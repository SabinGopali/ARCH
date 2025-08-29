import Product from "../models/product.model.js"; 
import fs from "fs";
import path from "path";
import SubUser from "../models/subuser.model.js";

function getActingOwnerUserIdFromReq(req) {
  // If subuser, act on behalf of supplierRef
  if (req.user?.isSubUser) {
    return req.user.supplierRef || req.user.supplierId;
  }
  return req.user?.id;
}

async function ensureCanDelete(req) {
  if (req.user?.isSubUser) {
    const subUser = await SubUser.findById(req.user.id).select("role");
    if (!subUser || subUser.role !== "Full Supplier Access") {
      return { allowed: false, message: "Insufficient permissions to delete" };
    }
  }
  return { allowed: true };
}

// 🟢 CREATE Product
export const createProduct = async (req, res) => {
  try {
    const productImages = (req.files["images"] || []).map(file =>
      path.join("/uploads/products", file.filename)
    );

    const variantData = JSON.parse(req.body.variants || "[]");
    const variants = variantData.map((variant, index) => {
      const images = (req.files[`variantImages_${index}`] || []).map(file =>
        path.join("/uploads/variants", file.filename)
      );
      return {
        name: variant.name,
        images,
      };
    });

    const ownerUserId = getActingOwnerUserIdFromReq(req);

    const newProduct = new Product({
      productName: req.body.productName,
      category: req.body.category,
      brand: req.body.brand,
      images: productImages,
      description: req.body.description,
      variants,
      price: req.body.price,
      specialPrice: req.body.specialPrice || 0,
      stock: req.body.stock || 0,
      sku: req.body.sku,
      freeItems: req.body.freeItems,
      available: req.body.available !== "false",
      warranty: {
        type: req.body.warrantyType,
        period: req.body.warrantyPeriod,
        policy: req.body.warrantyPolicy,
      },
      userRef: ownerUserId,
      userMail: req.body.userMail,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Create product error:", error); // already present
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
};

// 🟠 GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// 🟡 GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const ownerUserId = getActingOwnerUserIdFromReq(req);
    if (product.userRef?.toString() !== String(ownerUserId)) {
      return res.status(403).json({ error: "Not authorized to update this product" });
    }

    // Handle updated product images
    const newImages = (req.files?.["images"] || []).map((file) =>
      path.join("/uploads/products", file.filename)
    );
    if (newImages.length > 0) {
      product.images.forEach((img) => {
        try {
          fs.unlinkSync("." + img);
        } catch {}
      });
      product.images = newImages;
    }

    // Handle updated variants
    const updatedVariants = JSON.parse(req.body.variants || "[]");
    const variants = updatedVariants.map((variant, index) => {
      const newVariantImages = (req.files?.[`variantImages_${index}`] || []).map(
        (file) => path.join("/uploads/variants", file.filename)
      );
      return {
        name: variant.name,
        images: newVariantImages.length ? newVariantImages : variant.images || [],
      };
    });

    // Update fields
    product.productName = req.body.productName;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.variants = variants;
    product.price = req.body.price;
    product.specialPrice = req.body.specialPrice || 0;
    product.stock = req.body.stock || 0;
    product.sku = req.body.sku;
    product.freeItems = req.body.freeItems;

    if (req.body.available !== undefined) {
      product.available =
        req.body.available === true || req.body.available === "true";
    }

    product.warranty = {
      type: req.body.warrantyType,
      period: req.body.warrantyPeriod,
      policy: req.body.warrantyPolicy,
    };

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// 🔄 Update only availability
export const updateAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const ownerUserId = getActingOwnerUserIdFromReq(req);
    if (product.userRef?.toString() !== String(ownerUserId)) {
      return res.status(403).json({ error: "Not authorized to update this product" });
    }

    if (req.body.available === undefined) {
      return res.status(400).json({ error: "'available' is required" });
    }

    product.available = req.body.available === true || req.body.available === "true";
    await product.save();
    return res.json({ message: "Availability updated", product });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update availability" });
  }
};

// 🔴 DELETE Product
export const deleteProduct = async (req, res) => {
  try {
    const permission = await ensureCanDelete(req);
    if (!permission.allowed) {
      return res.status(403).json({ error: permission.message });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const ownerUserId = getActingOwnerUserIdFromReq(req);
    if (product.userRef?.toString() !== String(ownerUserId)) {
      return res.status(403).json({ error: "Not authorized to delete this product" });
    }

    // Remove all image files
    product.images.forEach(img => {
      const fullPath = "." + img;
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    product.variants.forEach(variant => {
      variant.images.forEach(img => {
        const fullPath = "." + img;
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};