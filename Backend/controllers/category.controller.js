import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import fs from "fs";
import path from "path";

// 🟢 CREATE Category
export const createCategory = async (req, res) => {
  try {
    const { name, description, parentCategory, tags, sortOrder } = req.body;

    // Handle category image upload
    const categoryImage = req.file 
      ? path.join("/uploads/categories", req.file.filename)
      : "";

    const newCategory = new Category({
      name,
      description,
      image: categoryImage,
      parentCategory: parentCategory || null,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      sortOrder: sortOrder || 0,
      createdBy: req.user?.email || "admin",
    });

    await newCategory.save();

    // If this is a subcategory, add it to parent's subcategories
    if (parentCategory) {
      await Category.findByIdAndUpdate(
        parentCategory,
        { $push: { subcategories: newCategory._id } }
      );
    }

    res.status(201).json({ 
      message: "Category created successfully", 
      category: newCategory 
    });
  } catch (error) {
    console.error("Create category error:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Category name already exists" });
    } else {
      res.status(500).json({ 
        error: "Failed to create category", 
        details: error.message 
      });
    }
  }
};

// 🟡 GET all categories (with optional filtering)
export const getAllCategories = async (req, res) => {
  try {
    const { 
      active, 
      parentOnly, 
      withSubcategories, 
      search,
      sortBy = "sortOrder",
      order = "asc"
    } = req.query;

    let query = {};
    
    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === "true";
    }

    // Filter to get only parent categories (no parent)
    if (parentOnly === "true") {
      query.parentCategory = null;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let categoriesQuery = Category.find(query);

    // Populate subcategories if requested
    if (withSubcategories === "true") {
      categoriesQuery = categoriesQuery.populate("subcategories");
    }

    // Populate parent category info
    categoriesQuery = categoriesQuery.populate("parentCategory", "name slug");

    // Sort results
    const sortOrder = order === "desc" ? -1 : 1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    categoriesQuery = categoriesQuery.sort(sortObj);

    const categories = await categoriesQuery;

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// 🟠 GET single category by ID or slug
export const getCategoryByIdOrSlug = async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let category = await Category.findById(identifier)
      .populate("subcategories")
      .populate("parentCategory", "name slug");
    
    if (!category) {
      category = await Category.findOne({ slug: identifier })
        .populate("subcategories")
        .populate("parentCategory", "name slug");
    }

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Get products in this category
    const products = await Product.find({ 
      category: category.name,
      available: true 
    }).limit(10);

    res.json({
      success: true,
      category: {
        ...category.toObject(),
        recentProducts: products
      }
    });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// 🔵 UPDATE Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory, tags, sortOrder, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image if exists
      if (category.image) {
        const oldImagePath = "." + category.image;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      category.image = path.join("/uploads/categories", req.file.filename);
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (tags) category.tags = tags.split(",").map(tag => tag.trim());

    // Handle parent category change
    if (parentCategory !== undefined) {
      // Remove from old parent if exists
      if (category.parentCategory) {
        await Category.findByIdAndUpdate(
          category.parentCategory,
          { $pull: { subcategories: category._id } }
        );
      }

      // Add to new parent if provided
      if (parentCategory) {
        category.parentCategory = parentCategory;
        await Category.findByIdAndUpdate(
          parentCategory,
          { $push: { subcategories: category._id } }
        );
      } else {
        category.parentCategory = null;
      }
    }

    await category.save();

    const updatedCategory = await Category.findById(id)
      .populate("subcategories")
      .populate("parentCategory", "name slug");

    res.json({ 
      message: "Category updated successfully", 
      category: updatedCategory 
    });
  } catch (error) {
    console.error("Update category error:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Category name already exists" });
    } else {
      res.status(500).json({ 
        error: "Failed to update category", 
        details: error.message 
      });
    }
  }
};

// 🔴 DELETE Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { forceDelete } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0 && forceDelete !== "true") {
      return res.status(400).json({ 
        error: "Cannot delete category with existing products",
        productCount,
        suggestion: "Use forceDelete=true to delete anyway or move products to another category"
      });
    }

    // Check if category has subcategories
    if (category.subcategories.length > 0 && forceDelete !== "true") {
      return res.status(400).json({ 
        error: "Cannot delete category with subcategories",
        subcategoryCount: category.subcategories.length,
        suggestion: "Delete subcategories first or use forceDelete=true"
      });
    }

    // Remove from parent's subcategories if exists
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(
        category.parentCategory,
        { $pull: { subcategories: category._id } }
      );
    }

    // Delete category image if exists
    if (category.image) {
      const imagePath = "." + category.image;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // If force delete, handle orphaned subcategories and products
    if (forceDelete === "true") {
      // Move subcategories to parent or make them root categories
      if (category.subcategories.length > 0) {
        await Category.updateMany(
          { _id: { $in: category.subcategories } },
          { parentCategory: category.parentCategory }
        );
      }

      // Optionally update products to "Uncategorized" or similar
      if (productCount > 0) {
        await Product.updateMany(
          { category: category.name },
          { category: "Uncategorized" }
        );
      }
    }

    await Category.findByIdAndDelete(id);

    res.json({ 
      message: "Category deleted successfully",
      deletedCategory: category.name,
      affectedProducts: forceDelete === "true" ? productCount : 0
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// 🟤 Get categories for suppliers (active categories only)
export const getCategoriesForSuppliers = async (req, res) => {
  try {
    const categories = await Category.find({ 
      isActive: true 
    })
    .select("name slug description icon parentCategory")
    .populate("parentCategory", "name slug")
    .sort({ sortOrder: 1, name: 1 });

    // Group by parent categories for better UX
    const parentCategories = categories.filter(cat => !cat.parentCategory);
    const subcategories = categories.filter(cat => cat.parentCategory);

    const categoriesWithSubs = parentCategories.map(parent => ({
      ...parent.toObject(),
      subcategories: subcategories.filter(sub => 
        sub.parentCategory._id.toString() === parent._id.toString()
      )
    }));

    res.json({
      success: true,
      categories: categoriesWithSubs,
      flatCategories: categories.map(cat => ({
        label: cat.name,
        value: cat.name,
        slug: cat.slug
      }))
    });
  } catch (error) {
    console.error("Get supplier categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories for suppliers" });
  }
};

// 🟣 Update product counts for all categories
export const updateCategoryCounts = async (req, res) => {
  try {
    const categories = await Category.find();
    
    for (const category of categories) {
      const productCount = await Product.countDocuments({ 
        category: category.name,
        available: true
      });
      
      category.productCount = productCount;
      await category.save();
    }

    res.json({ 
      message: "Category product counts updated successfully",
      updatedCategories: categories.length
    });
  } catch (error) {
    console.error("Update category counts error:", error);
    res.status(500).json({ error: "Failed to update category counts" });
  }
};