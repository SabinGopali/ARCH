import mongoose from "mongoose";


const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [String], 
});

const productSchema  = new mongoose.Schema(
{
    
    images: {
  type: [String],
  required: true,
},
   productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String, // HTML content from TipTap editor
      required: true,
    },
    variants: {
      type: [variantSchema],
      default: [],
    },
    price: {
      type: Number,
      required: true,
    },
    specialPrice: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sku: {
      type: String,
      trim: true,
    },
    freeItems: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
warranty: {
      type: {
        type: String,
        enum: ["Manufacturer", "Seller", "No"],
        default: "No",
      },
      period: {
        type: String,
        default: "",
      },
      policy: {
        type: String,
        default: "",
      },
    },
    userRef: {
      type: String,
      required: true,
    },
    userMail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model('product', productSchema);

export default Product;