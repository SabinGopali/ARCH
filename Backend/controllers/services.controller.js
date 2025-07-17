import { errorHandler } from "../utils/error.js";
import service from "../models/services.model.js";

// ✅ Get a single service by ID
export const getallservices = async (req, res, next) => {
  try {
    const foundService = await service.findById(req.params.id);
    if (!foundService) {
      return next(errorHandler(404, "Service not found"));
    }
    res.status(200).json(foundService);
  } catch (error) {
    next(error);
  }
};

export const createservice = async (req, res, next) => {
  try {
    const { s_title, s_description, userRef, userMail } = req.body;
    const s_link = req.file?.path;

    if (!s_title || !s_description || !userRef || !userMail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!s_link) {
      return res.status(400).json({ error: "Video or image file is required" });
    }

    const newService = await service.create({
      s_title,
      s_description,
      s_link,
      userRef,
      userMail,
    });

    return res.status(201).json({
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


// ✅ Delete a service by ID
export const deleteservice = async (req, res, next) => {
  try {
    const foundService = await service.findById(req.params.id);

    if (!foundService) {
      return next(errorHandler(404, "Service not found"));
    }

    if (!req.user.isAdmin && req.user.id !== foundService.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own service"));
    }

    await service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service has been deleted!" });
  } catch (error) {
    next(error);
  }
};

// ✅ Update a service by ID
export const updateservice = async (req, res, next) => {
  try {
    const foundService = await service.findById(req.params.id);
    if (!foundService) {
      return next(errorHandler(404, "Service not found"));
    }

    if (!req.user.isAdmin && req.user.id !== foundService.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own service"));
    }

    if (req.file?.path) {
      req.body.s_link = req.file.path;
    }

    const updatedService = await service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      service: updatedService,
      message: "Service updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Search/filter/sort services and count totals
export const getservice = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const query = {};

    if (searchTerm) {
      query.$or = [
        { s_title: { $regex: searchTerm, $options: "i" } },
        { userMail: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const services = await service.find(query).sort({ [sort]: order });
    const totalservices = await service.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthservices = await service.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      success: true,
      services,
      totalservices,
      lastMonthservices,
    });
  } catch (error) {
    next(error);
  }
};
