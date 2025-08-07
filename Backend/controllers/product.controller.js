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

// 🟡 GET categories from supplier products
export const getSupplierCategories = async (req, res) => {
  try {
    // Import User model to check supplier status
    const User = (await import("../models/user.model.js")).default;
    
    // Get all suppliers
    const suppliers = await User.find({ isSupplier: true });
    const supplierIds = suppliers.map(supplier => supplier._id.toString());
    const supplierEmails = suppliers.map(supplier => supplier.email);
    
    // Get products created by suppliers
    const supplierProducts = await Product.find({
      $or: [
        { userRef: { $in: supplierIds } },
        { userMail: { $in: supplierEmails } }
      ]
    });

    // Extract unique categories
    const categories = [...new Set(supplierProducts.map(product => product.category))];
    
    // Create category objects with additional info
    const categoryData = categories.map(category => {
      const productsInCategory = supplierProducts.filter(p => p.category === category);
      const supplierCompanies = productsInCategory.map(p => {
        const supplier = suppliers.find(s => s._id.toString() === p.userRef || s.email === p.userMail);
        return supplier ? supplier.company_name : 'Unknown Supplier';
      });
      
      return {
        label: category,
        slug: category
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        productCount: productsInCategory.length,
        suppliers: [...new Set(supplierCompanies)]
      };
    });

    res.json(categoryData);
  } catch (error) {
    console.error("Get supplier categories error:", error);
    res.status(500).json({ error: "Failed to fetch supplier categories" });
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

    // Handle updated product images
    const newImages = (req.files?.["images"] || []).map((file) =>
      path.join("/uploads/products", file.filename)
    );
    if (newImages.length > 0) {
      product.images.forEach((img) => {
        try {
          fs.unlinkSync("." + img); // Delete old files safely
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
