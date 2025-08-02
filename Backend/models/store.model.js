import mongoose from "mongoose";

const storeProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true, // Each user has only one profile
  },
  companyDescription: String,
  city: String,
  street: String,
  postCode: String,
  openingHours: [
    {
      day: String,
      open: String,
      close: String,
      enabled: Boolean,
    },
  ],
  logo: String,
  bgImage: String,
}, { timestamps: true });

export default mongoose.model("StoreProfile", storeProfileSchema);
