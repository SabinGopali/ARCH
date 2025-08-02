import mongoose from "mongoose";

const subUserSchema = new mongoose.Schema({
  supplierRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Full Supplier Access", "Asset Management Control"],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const SubUser = mongoose.model("subuser", subUserSchema);
export default SubUser;
