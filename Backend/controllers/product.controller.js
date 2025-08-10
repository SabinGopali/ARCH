import Product from "../models/product.model.js"; 
import fs from "fs";
import path from "path";

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
  userRef: req.body.userRef,   
  userMail: req.body.userMail,
});

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
  console.error("Create product error:", error); // already present
  res.status(500).json({ error: "Failed to create product", details: error.message });
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



export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Parse incoming lists for main images
    const existingImages = JSON.parse(req.body.existingImages || "null"); // array of paths to keep
    const imagesToDelete = JSON.parse(req.body.imagesToDelete || "[]"); // array of paths to delete

    // Gather newly uploaded main images
    const uploadedMainImages = (req.files?.["images"] || []).map((file) =>
      path.join("/uploads/products", file.filename)
    );

    if (Array.isArray(existingImages)) {
      // Compute final list and delete removed files
      const keepSet = new Set(existingImages);
      const removedFromExisting = (product.images || []).filter((img) => !keepSet.has(img));

      // Delete explicitly provided deletions and any removed ones not in keep
      const deletionCandidates = new Set([...imagesToDelete, ...removedFromExisting]);
      deletionCandidates.forEach((img) => {
        try {
          if (img) fs.unlinkSync("." + img);
        } catch {}
      });

      // Final images = kept ones + newly uploaded ones
      product.images = [...existingImages, ...uploadedMainImages];
    } else if (uploadedMainImages.length > 0) {
      // Backward compatible behavior: replace all when new uploaded without existingImages provided
      (product.images || []).forEach((img) => {
        try {
          if (img) fs.unlinkSync("." + img);
        } catch {}
      });
      product.images = uploadedMainImages;
    }

    // Handle updated variants
    const bodyVariants = JSON.parse(req.body.variants || "[]");

    // Build new variants array using indexes aligned with provided variants
    const updatedVariants = bodyVariants.map((variant, index) => {
      const newVariantImages = (req.files?.[`variantImages_${index}`] || []).map((file) =>
        path.join("/uploads/variants", file.filename)
      );

      const keepVariantImages = Array.isArray(variant.existingImages)
        ? variant.existingImages
        // Backward compatibility: allow `images` to be used for keeping existing images
        : Array.isArray(variant.images)
        ? variant.images
        : [];

      const variantImagesToDelete = Array.isArray(variant.imagesToDelete)
        ? variant.imagesToDelete
        : [];

      // Compute deletions for variant: anything explicitly requested, plus anything removed from keep
      const originalVariantImages = (product.variants?.[index]?.images) || [];
      const keepSet = new Set(keepVariantImages);
      const removedFromExisting = originalVariantImages.filter((img) => !keepSet.has(img));
      const deletionCandidates = new Set([...variantImagesToDelete, ...removedFromExisting]);
      deletionCandidates.forEach((img) => {
        try {
          if (img) fs.unlinkSync("." + img);
        } catch {}
      });

      return {
        name: variant.name,
        images: [...keepVariantImages, ...newVariantImages],
      };
    });

    if (updatedVariants.length > 0) {
      product.variants = updatedVariants;
    }

    // Update fields
    product.productName = req.body.productName;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.description = req.body.description;
    product.price = req.body.price;
    product.specialPrice = req.body.specialPrice || 0;
    product.stock = req.body.stock || 0;
    product.sku = req.body.sku;
    product.freeItems = req.body.freeItems;

    if (req.body.available !== undefined) {
      product.available = req.body.available === true || req.body.available === "true";
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


// 🔴 DELETE Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

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
