import StoreProfile from '../models/store.model.js';

// Get store profile
export const getStoreProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id; // Fallback to token if no param

    const storeProfile = await StoreProfile.findOne({ userId });

    if (!storeProfile) {
      return res.status(404).json({ message: "Store profile not found" });
    }

    res.status(200).json({ storeProfile });
  } catch (err) {
    console.error("Error fetching store profile:", err);
    res.status(500).json({ message: "Failed to fetch store profile" });
  }
};

// Create or Update store profile
export const createOrUpdateStoreProfile = async (req, res, next) => {
  try {
const userId = req.body.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const {
      companyDescription,
      city,
      street,
      postCode,
      openingHours,
    } = req.body;

    if (!companyDescription || !city || !street) {
      return res.status(400).json({ message: "Company description, city, and street are required." });
    }

    const logo = req.files?.logo?.[0]?.path?.replace(/\\/g, "/") || "";
    const bgImage = req.files?.bgImage?.[0]?.path?.replace(/\\/g, "/") || "";

    let parsedOpeningHours = [];
    try {
      parsedOpeningHours = JSON.parse(openingHours || "[]");
    } catch (e) {
      return res.status(400).json({ message: "Invalid openingHours format" });
    }

    console.log("Incoming Store Data:", {
      userId,
      companyDescription,
      city,
      street,
      postCode,
      logo,
      bgImage,
      openingHours: parsedOpeningHours,
    });

    const existingProfile = await StoreProfile.findOne({ userId });

    if (existingProfile) {
      existingProfile.companyDescription = companyDescription;
      existingProfile.city = city;
      existingProfile.street = street;
      existingProfile.postCode = postCode;
      existingProfile.openingHours = parsedOpeningHours;

      if (logo) existingProfile.logo = logo;
      if (bgImage) existingProfile.bgImage = bgImage;

      await existingProfile.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        storeProfile: existingProfile,
      });
    }

    const newProfile = new StoreProfile({
      userId,
      companyDescription,
      city,
      street,
      postCode,
      openingHours: parsedOpeningHours,
      logo,
      bgImage,
    });

    await newProfile.save();

    res.status(201).json({
      message: "Profile created successfully",
      storeProfile: newProfile,
    });
  } catch (err) {
  console.error("💥 StoreProfile save failed:", err); // Logs full error on server
  return res.status(500).json({
    message: "Failed to save store profile",
    error: err?.message || "Unknown error",
    stack: err?.stack, // optional, helpful for debugging
  });
}
};

// Delete store profile
export const deleteStoreProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const deletedProfile = await StoreProfile.findOneAndDelete({ userId });
    
    if (!deletedProfile) {
      return res.status(404).json({ message: "Store profile not found" });
    }

    res.status(200).json({ message: "Store profile deleted successfully" });
  } catch (err) {
    console.error("Error deleting store profile:", err);
    res.status(500).json({ message: "Failed to delete store profile" });
  }
};