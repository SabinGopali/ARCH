import mongoose from "mongoose";
import Category from "../models/category.model.js";
import dotenv from "dotenv";

dotenv.config();

const categories = [
  // Electronics & Technology
  {
    name: "Electronics",
    description: "Electronic devices, gadgets, and technology products",
    sortOrder: 1,
    icon: "🔌",
    subcategories: [
      { name: "Smartphones", description: "Mobile phones and accessories" },
      { name: "Laptops & Computers", description: "Desktop computers, laptops, and peripherals" },
      { name: "Audio & Video", description: "Headphones, speakers, cameras, and entertainment devices" },
      { name: "Gaming", description: "Gaming consoles, accessories, and gaming peripherals" },
      { name: "Smart Home", description: "IoT devices, smart lights, security systems" },
      { name: "Wearables", description: "Smartwatches, fitness trackers, and wearable tech" },
    ]
  },

  // Fashion & Apparel
  {
    name: "Fashion & Apparel",
    description: "Clothing, shoes, and fashion accessories for all ages",
    sortOrder: 2,
    icon: "👕",
    subcategories: [
      { name: "Men's Clothing", description: "Shirts, pants, jackets, and men's fashion" },
      { name: "Women's Clothing", description: "Dresses, tops, bottoms, and women's fashion" },
      { name: "Kids' Clothing", description: "Children's and baby clothing" },
      { name: "Shoes & Footwear", description: "Sneakers, boots, sandals, and all types of footwear" },
      { name: "Accessories", description: "Bags, belts, watches, jewelry, and fashion accessories" },
      { name: "Sportswear", description: "Athletic wear, gym clothes, and sports accessories" },
    ]
  },

  // Home & Garden
  {
    name: "Home & Garden",
    description: "Home improvement, furniture, decor, and gardening supplies",
    sortOrder: 3,
    icon: "🏠",
    subcategories: [
      { name: "Furniture", description: "Chairs, tables, beds, and home furniture" },
      { name: "Home Decor", description: "Wall art, decorative items, and home accessories" },
      { name: "Kitchen & Dining", description: "Cookware, dinnerware, and kitchen appliances" },
      { name: "Bedding & Bath", description: "Sheets, towels, and bathroom accessories" },
      { name: "Garden & Outdoor", description: "Plants, garden tools, and outdoor furniture" },
      { name: "Storage & Organization", description: "Storage boxes, shelving, and organization solutions" },
    ]
  },

  // Health & Beauty
  {
    name: "Health & Beauty",
    description: "Personal care, wellness, and beauty products",
    sortOrder: 4,
    icon: "💄",
    subcategories: [
      { name: "Skincare", description: "Face care, moisturizers, and skincare treatments" },
      { name: "Makeup & Cosmetics", description: "Lipstick, foundation, eyeshadow, and beauty products" },
      { name: "Hair Care", description: "Shampoo, conditioner, styling products, and hair tools" },
      { name: "Personal Care", description: "Toothpaste, deodorant, and hygiene products" },
      { name: "Health Supplements", description: "Vitamins, protein powders, and nutritional supplements" },
      { name: "Fitness Equipment", description: "Exercise machines, weights, and fitness accessories" },
    ]
  },

  // Sports & Recreation
  {
    name: "Sports & Recreation",
    description: "Sports equipment, outdoor gear, and recreational activities",
    sortOrder: 5,
    icon: "⚽",
    subcategories: [
      { name: "Exercise & Fitness", description: "Gym equipment, yoga mats, and workout gear" },
      { name: "Outdoor Sports", description: "Camping, hiking, fishing, and outdoor adventure gear" },
      { name: "Team Sports", description: "Football, basketball, soccer, and team sport equipment" },
      { name: "Water Sports", description: "Swimming, surfing, and water activity equipment" },
      { name: "Winter Sports", description: "Skiing, snowboarding, and winter sports gear" },
      { name: "Cycling", description: "Bicycles, bike accessories, and cycling gear" },
    ]
  },

  // Automotive
  {
    name: "Automotive",
    description: "Car parts, accessories, and automotive supplies",
    sortOrder: 6,
    icon: "🚗",
    subcategories: [
      { name: "Car Parts", description: "Engine parts, brakes, filters, and replacement parts" },
      { name: "Car Accessories", description: "Car covers, seat covers, and interior accessories" },
      { name: "Tools & Equipment", description: "Automotive tools, diagnostic equipment, and maintenance supplies" },
      { name: "Tires & Wheels", description: "Car tires, rims, and wheel accessories" },
      { name: "Electronics", description: "Car stereos, GPS systems, and automotive electronics" },
      { name: "Cleaning & Care", description: "Car wash supplies, wax, and detailing products" },
    ]
  },

  // Books & Media
  {
    name: "Books & Media",
    description: "Books, movies, music, and educational materials",
    sortOrder: 7,
    icon: "📚",
    subcategories: [
      { name: "Books", description: "Fiction, non-fiction, textbooks, and e-books" },
      { name: "Movies & TV", description: "DVDs, Blu-rays, and digital media" },
      { name: "Music", description: "CDs, vinyl records, and musical instruments" },
      { name: "Educational", description: "Learning materials, courses, and educational resources" },
      { name: "Magazines", description: "Periodicals, newspapers, and subscription media" },
    ]
  },

  // Food & Beverages
  {
    name: "Food & Beverages",
    description: "Food products, drinks, and culinary supplies",
    sortOrder: 8,
    icon: "🍎",
    subcategories: [
      { name: "Fresh Food", description: "Fruits, vegetables, meat, and fresh groceries" },
      { name: "Packaged Food", description: "Snacks, canned goods, and packaged meals" },
      { name: "Beverages", description: "Water, soft drinks, coffee, tea, and alcoholic beverages" },
      { name: "Organic & Natural", description: "Organic foods, natural products, and health foods" },
      { name: "International Cuisine", description: "Specialty foods from different cultures and regions" },
      { name: "Baking & Cooking", description: "Ingredients, spices, and cooking supplies" },
    ]
  },

  // Baby & Kids
  {
    name: "Baby & Kids",
    description: "Products for babies, children, and parents",
    sortOrder: 9,
    icon: "👶",
    subcategories: [
      { name: "Baby Gear", description: "Strollers, car seats, and baby equipment" },
      { name: "Baby Food & Formula", description: "Baby food, formula, and feeding supplies" },
      { name: "Toys & Games", description: "Educational toys, games, and entertainment for kids" },
      { name: "Baby Clothing", description: "Clothes, shoes, and accessories for babies and toddlers" },
      { name: "Nursery", description: "Cribs, changing tables, and nursery furniture" },
      { name: "Safety", description: "Baby proofing, monitors, and safety equipment" },
    ]
  },

  // Arts & Crafts
  {
    name: "Arts & Crafts",
    description: "Art supplies, craft materials, and creative tools",
    sortOrder: 10,
    icon: "🎨",
    subcategories: [
      { name: "Art Supplies", description: "Paints, brushes, canvases, and drawing materials" },
      { name: "Crafting Materials", description: "Fabric, yarn, beads, and craft supplies" },
      { name: "Sewing & Knitting", description: "Sewing machines, patterns, and textile crafts" },
      { name: "DIY & Making", description: "Tools and materials for do-it-yourself projects" },
      { name: "Scrapbooking", description: "Photo albums, decorative papers, and memory keeping" },
    ]
  },

  // Business & Industrial
  {
    name: "Business & Industrial",
    description: "Business equipment, office supplies, and industrial products",
    sortOrder: 11,
    icon: "🏢",
    subcategories: [
      { name: "Office Supplies", description: "Pens, paper, folders, and office essentials" },
      { name: "Office Equipment", description: "Printers, scanners, shredders, and office machines" },
      { name: "Industrial Supplies", description: "Safety equipment, tools, and industrial materials" },
      { name: "Shipping & Packaging", description: "Boxes, tape, labels, and packaging materials" },
      { name: "Business Services", description: "Software, consulting, and business solutions" },
    ]
  },

  // Pet Supplies
  {
    name: "Pet Supplies",
    description: "Products and supplies for pets and animals",
    sortOrder: 12,
    icon: "🐕",
    subcategories: [
      { name: "Dog Supplies", description: "Dog food, toys, leashes, and dog accessories" },
      { name: "Cat Supplies", description: "Cat food, litter, toys, and cat accessories" },
      { name: "Pet Food", description: "Food and treats for all types of pets" },
      { name: "Pet Health", description: "Medications, supplements, and health products for pets" },
      { name: "Pet Accessories", description: "Beds, carriers, and general pet accessories" },
    ]
  }
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Create parent categories and their subcategories
    for (const categoryData of categories) {
      // Create parent category
      const parentCategory = new Category({
        name: categoryData.name,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
        icon: categoryData.icon,
        createdBy: "system-seed",
      });

      await parentCategory.save();
      console.log(`Created parent category: ${parentCategory.name}`);

      // Create subcategories if they exist
      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        for (let i = 0; i < categoryData.subcategories.length; i++) {
          const subData = categoryData.subcategories[i];
          const subcategory = new Category({
            name: subData.name,
            description: subData.description,
            parentCategory: parentCategory._id,
            sortOrder: i + 1,
            createdBy: "system-seed",
          });

          await subcategory.save();
          
          // Add to parent's subcategories array
          parentCategory.subcategories.push(subcategory._id);
          
          console.log(`  Created subcategory: ${subcategory.name}`);
        }
        
        // Save parent with updated subcategories
        await parentCategory.save();
      }
    }

    console.log("✅ Category seeding completed successfully!");
    console.log(`Total categories created: ${await Category.countDocuments()}`);
    
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

export default seedCategories;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCategories();
}