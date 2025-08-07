# Category Management System

This document explains the comprehensive category management system implemented for suppliers and product categorization.

## Overview

The category system provides:
- **Predefined Categories**: A comprehensive list of product categories across multiple industries
- **Hierarchical Structure**: Parent categories with subcategories for better organization
- **Supplier Integration**: Easy category selection for suppliers when adding products
- **Flexible API**: Complete CRUD operations for category management

## 🏗️ System Architecture

### Backend Components

1. **Category Model** (`/Backend/models/category.model.js`)
   - Hierarchical category structure with parent-child relationships
   - Automatic slug generation
   - Support for images, icons, and descriptions
   - Active/inactive status management

2. **Category Controller** (`/Backend/controllers/category.controller.js`)
   - Full CRUD operations
   - Supplier-specific endpoints
   - Search and filtering capabilities
   - Product count tracking

3. **Category Routes** (`/Backend/routes/category.route.js`)
   - Protected admin routes for category management
   - Public routes for category browsing
   - Supplier-specific routes

### Frontend Components

1. **Categories Component** (`/Archphaze/src/shop/Categories.jsx`)
   - Displays categories with beautiful flip card animations
   - Falls back to product-based categories if needed
   - Responsive grid layout

2. **CategorySelector Component** (`/Archphaze/src/supplier/CategorySelector.jsx`)
   - Hierarchical category selection for suppliers
   - Real-time subcategory loading
   - Form validation support

## 📦 Available Categories

The system includes 12 main categories with 70+ subcategories:

### Main Categories:
1. **Electronics** 🔌
   - Smartphones, Laptops & Computers, Audio & Video, Gaming, Smart Home, Wearables

2. **Fashion & Apparel** 👕
   - Men's/Women's/Kids' Clothing, Shoes & Footwear, Accessories, Sportswear

3. **Home & Garden** 🏠
   - Furniture, Home Decor, Kitchen & Dining, Bedding & Bath, Garden & Outdoor

4. **Health & Beauty** 💄
   - Skincare, Makeup & Cosmetics, Hair Care, Personal Care, Health Supplements

5. **Sports & Recreation** ⚽
   - Exercise & Fitness, Outdoor Sports, Team Sports, Water Sports, Winter Sports

6. **Automotive** 🚗
   - Car Parts, Car Accessories, Tools & Equipment, Tires & Wheels

7. **Books & Media** 📚
   - Books, Movies & TV, Music, Educational, Magazines

8. **Food & Beverages** 🍎
   - Fresh Food, Packaged Food, Beverages, Organic & Natural

9. **Baby & Kids** 👶
   - Baby Gear, Baby Food & Formula, Toys & Games, Nursery, Safety

10. **Arts & Crafts** 🎨
    - Art Supplies, Crafting Materials, Sewing & Knitting, DIY & Making

11. **Business & Industrial** 🏢
    - Office Supplies, Office Equipment, Industrial Supplies, Shipping & Packaging

12. **Pet Supplies** 🐕
    - Dog/Cat Supplies, Pet Food, Pet Health, Pet Accessories

## 🚀 Setup Instructions

### 1. Environment Setup

Create a `.env` file in the project root:

```env
MONGO=mongodb://localhost:27017/archphaze
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
PORT=3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed Categories

Option A - Automatic Setup:
```bash
node Backend/scripts/setup.js
```

Option B - Manual Seeding:
```bash
node Backend/utils/seedCategories.js
```

### 4. Start the Application

```bash
# Start Backend
cd Backend && node index.js

# Start Frontend
cd Archphaze && npm run dev
```

## 🔌 API Endpoints

### Public Endpoints

#### Get All Categories
```http
GET /backend/category/getall
```

Query Parameters:
- `active`: Filter by active status (true/false)
- `parentOnly`: Get only parent categories (true/false)
- `withSubcategories`: Include subcategories (true/false)
- `search`: Search by name or description
- `sortBy`: Sort field (sortOrder, name, createdAt)
- `order`: Sort order (asc/desc)

#### Get Categories for Suppliers
```http
GET /backend/category/suppliers
```

Returns hierarchical categories and flat list for easy dropdown usage.

#### Get Single Category
```http
GET /backend/category/get/:identifier
```

Get category by ID or slug with recent products.

### Admin Endpoints (Require Authentication)

#### Create Category
```http
POST /backend/category/create
Content-Type: multipart/form-data

{
  "name": "Category Name",
  "description": "Category description",
  "parentCategory": "parent_id", // optional
  "tags": "tag1,tag2,tag3", // optional
  "sortOrder": 1, // optional
  "image": file // optional
}
```

#### Update Category
```http
PUT /backend/category/update/:id
Content-Type: multipart/form-data
```

#### Delete Category
```http
DELETE /backend/category/delete/:id?forceDelete=true
```

#### Update Product Counts
```http
POST /backend/category/update-counts
```

## 🎨 Frontend Usage

### Using Categories Component

```jsx
import Categories from './shop/Categories';

function App() {
  return (
    <div>
      <Categories />
    </div>
  );
}
```

### Using CategorySelector for Suppliers

```jsx
import CategorySelector from './supplier/CategorySelector';

function ProductForm() {
  const [category, setCategory] = useState('');
  const [categoryError, setCategoryError] = useState('');

  return (
    <form>
      <CategorySelector
        value={category}
        onChange={setCategory}
        error={categoryError}
        className="mb-4"
      />
    </form>
  );
}
```

## 🔧 Customization

### Adding New Categories

1. **Via API** (Recommended for admin users):
```javascript
const response = await fetch('/backend/category/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'New Category',
    description: 'Category description',
    sortOrder: 13
  }),
  credentials: 'include'
});
```

2. **Via Seed Script** (For initial setup):
   - Edit `/Backend/utils/seedCategories.js`
   - Add your categories to the `categories` array
   - Run the seed script

### Customizing Category Display

The Categories component uses CSS-in-JS for the flip card animations. You can customize:

- **Colors**: Modify the gradient colors in the card design
- **Animations**: Adjust transition durations and effects
- **Layout**: Change grid columns and spacing
- **Typography**: Update fonts and text styles

## 🛡️ Security & Permissions

- **Public Access**: Browse categories, view category details
- **Supplier Access**: Select categories for products
- **Admin Access**: Create, update, delete categories
- **Authentication**: JWT-based authentication for protected routes

## 📊 Monitoring & Analytics

The system tracks:
- Product counts per category
- Category usage statistics
- Popular categories
- Category hierarchy effectiveness

## 🐛 Troubleshooting

### Common Issues

1. **Categories not loading**:
   - Check MongoDB connection
   - Verify `.env` file configuration
   - Run seed script if database is empty

2. **Supplier category selector not working**:
   - Ensure backend is running
   - Check browser console for API errors
   - Verify authentication if required

3. **Duplicate categories after seeding**:
   - The seed script clears existing categories first
   - Check for manual duplicates in the seed data

### Error Handling

The system includes comprehensive error handling:
- Graceful fallback to product-based categories
- User-friendly error messages
- Retry mechanisms for failed requests
- Validation errors for form inputs

## 🚀 Future Enhancements

Potential improvements:
- **Category Analytics Dashboard**
- **Auto-categorization using AI**
- **Category Performance Metrics**
- **Multi-language Category Support**
- **Category Import/Export Tools**
- **Advanced Search and Filtering**

## 📝 Notes

- Categories are cached for better performance
- Subcategories automatically inherit parent permissions
- Category slugs are automatically generated and unique
- The system supports both hierarchical and flat category structures
- Product counts are updated automatically when products are added/removed