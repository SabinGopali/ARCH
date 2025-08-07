import React, { useEffect, useState } from "react";

export default function CategorySelector({ value, onChange, error, className = "" }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/backend/category/suppliers", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          
          if (data.success && data.categories) {
            setCategories(data.categories);
          } else {
            throw new Error("Invalid response format");
          }
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleParentChange = (parentCategory) => {
    setSelectedParent(parentCategory);
    
    // Find subcategories for the selected parent
    const parent = categories.find(cat => cat.name === parentCategory);
    if (parent && parent.subcategories) {
      setSubcategories(parent.subcategories);
    } else {
      setSubcategories([]);
    }

    // If parent is selected and has no subcategories, set it as the value
    if (!parent?.subcategories || parent.subcategories.length === 0) {
      onChange(parentCategory);
    } else {
      // Clear the selected value since we need to select a subcategory
      onChange("");
    }
  };

  const handleSubcategoryChange = (subcategory) => {
    onChange(subcategory);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Parent Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category *
        </label>
        <select
          value={selectedParent}
          onChange={(e) => handleParentChange(e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500" : ""
          }`}
        >
          <option value="">Choose a category...</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.icon} {category.name}
              {category.subcategories && category.subcategories.length > 0 && " →"}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory Selection */}
      {selectedParent && subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Subcategory *
          </label>
          <select
            value={value}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : ""
            }`}
          >
            <option value="">Choose a subcategory...</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory.name}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Selected Category Display */}
      {value && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            <span className="font-medium">Selected:</span> {value}
            {selectedParent && selectedParent !== value && (
              <span className="text-green-600"> (under {selectedParent})</span>
            )}
          </p>
        </div>
      )}

      {/* Category Description */}
      {selectedParent && (
        <div className="text-sm text-gray-600">
          {categories.find(cat => cat.name === selectedParent)?.description}
        </div>
      )}
    </div>
  );
}