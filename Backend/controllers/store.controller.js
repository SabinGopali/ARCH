import StoreProfile from "../models/store.model.js";

// Create store profile controller
export const createStoreProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // from verifyToken middleware

    const {
      companyDescription,
      city,
      street,
      postCode,
      openingHours,
    } = req.body;

    const logo = req.files?.logo?.[0]?.path?.replace(/\\/g, "/") || "";
    const bgImage = req.files?.bgImage?.[0]?.path?.replace(/\\/g, "/") || "";

    // Check if profile already exists for user
    const existingProfile = await StoreProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

    let parsedOpeningHours = [];
    try {
      parsedOpeningHours = JSON.parse(openingHours || "[]");
    } catch (e) {
      return res.status(400).json({ message: "Invalid openingHours format" });
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
    res.status(201).json({ message: "Profile created", storeProfile: newProfile });
  } catch (err) {
    console.error("Error creating store profile:", err);
    res.status(500).json({ message: "Failed to create store profile" });
  }
};



// Update store profile controller
export const updateStoreProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const {
      companyDescription,
      city,
      street,
      postCode,
      openingHours,
    } = req.body;

    const logo = req.files?.logo?.[0]?.path?.replace(/\\/g, "/");
    const bgImage = req.files?.bgImage?.[0]?.path?.replace(/\\/g, "/");

    const existingProfile = await StoreProfile.findOne({ userId });
    if (!existingProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    existingProfile.companyDescription = companyDescription;
    existingProfile.city = city;
    existingProfile.street = street;
    existingProfile.postCode = postCode;
    existingProfile.openingHours = JSON.parse(openingHours || "[]");

    if (logo) existingProfile.logo = logo;
    if (bgImage) existingProfile.bgImage = bgImage;

    await existingProfile.save();
    res.status(200).json({ message: "Profile updated", storeProfile: existingProfile });
  } catch (err) {
    console.error("Error updating store profile:", err);
    res.status(500).json({ message: "Failed to update store profile" });
  }
};

export const getStoreProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const storeProfile = await StoreProfile.findOne({ userId });
    if (!storeProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ storeProfile });
  } catch (err) {
    console.error("Error fetching store profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStoreProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    await StoreProfile.findOneAndDelete({ userId });
    res.status(200).json({ message: "Store profile deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete profile" });
  }
};
