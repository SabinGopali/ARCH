import { errorHandler } from "../utils/error.js";
import form from "../models/form.model.js";




export const viewform = async (req, res, next) => {
  try {
    const singleForm = await form.findById(req.params.id);
    if (!singleForm) {
      return next(errorHandler(404, "Form not found"));
    }
    res.status(200).json({
      success: true,
      form: singleForm,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get a single form by ID
export const getallforms = async (req, res, next) => {
  try {
    const foundform = await form.findById(req.params.id);
    if (!foundform) {
      return next(errorHandler(404, "form not found"));
    }
    res.status(200).json(foundform);
  } catch (error) {
    next(error);
  }
};

// ✅ Create a new form entry
export const createform = async (req, res, next) => {
  try {
    const newform = await form.create(req.body); // ✅ fixed model name
    return res.status(201).json(newform);
  } catch (error) {
    next(error);
  }
};

// ✅ Delete a form entry
export const deleteform = async (req, res, next) => {
  try {
    const Dform = await form.findById(req.params.id);
    if (!Dform) {
      return next(errorHandler(404, 'Application not found'));
    }

    if (!req.user?.isAdmin && req.user?.id !== Dform.userRef.toString()) {
      return next(errorHandler(401, 'You can only delete your own application!'));
    }

    await form.findByIdAndDelete(req.params.id);
    res.status(200).json('Application has been deleted!');
  } catch (error) {
    next(error);
  }
};

// ✅ Update a form entry
export const updateform = async (req, res, next) => {
  try {
    const Uform = await form.findById(req.params.id);
    if (!Uform) {
      return next(errorHandler(404, "form not found"));
    }

    if (!req.user?.isAdmin && req.user?.id !== Uform.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own form info!"));
    }

    const updatedform = await form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      form: updatedform,
      message: "form info updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all form entries with optional search and stats


export const getform = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = {};

    // 🔍 Search by fullname or userMail
    if (searchTerm) {
      query.$or = [
        { fullname: { $regex: searchTerm, $options: 'i' } },
        { userMail: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const forms = await form.find(query).sort({ [sort]: order });

    const totalforms = await form.countDocuments();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthforms = await form.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      success: true,
      forms,
      totalforms,
      lastMonthforms,
    });
  } catch (error) {
    next(error);
  }
};
