import { errorHandler } from "../utils/error.js";
import partner from "../models/partner.model.js"; 


export const getallpartners = async (req, res, next) => {
  try {
    const foundPartner = await partner.findById(req.params.id);
    if (!foundPartner) {
      return next(errorHandler(404, "Partner not found"));
    }
    res.status(200).json(foundPartner);
  } catch (error) {
    next(error);
  }
};

export const createpartner = async (req, res, next) => {
  try {
    const newpartner = await partner.create(req.body); 
    return res.status(201).json(newpartner);
  } catch (error) {
    next(error);
  }
};


export const deletepartner = async (req, res, next) =>{
    const Dpartner = await partner.findById(req.params.id);

    if (!Dpartner) {
        return next (errorHandler(404, 'Application not found'));
    }
    if (!req.user.isAdmin && req.user.id !== Dpartner.userRef.toString()) {
    return next(errorHandler(401, 'You can only update your own application!'));
}
    try {
        await partner.findByIdAndDelete(req.params.id);
        res.status(200).json('Application has been deleted! ')
    } catch (error) {
        next(error);
    }
}

export const updatepartner = async (req, res, next) => {
  try {
    const Upartner = await partner.findById(req.params.id);
    if (!Upartner) {
      return next(errorHandler(404, "partner not found"));
    }
    // Assuming userRef field exists on partner document to check ownership
    if (!req.user.isAdmin && req.user.id !== Upartner.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own partner info!"));
    }

    const updatedpartner = await partner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      partner: updatedpartner,
      message: "partner info updated successfully",
    });
  } catch (error) {
    next(error);
  }
};




export const getpartner = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = {};

    // Search by position or userMail (adjusted based on your schema)
    if (searchTerm) {
      query.$or = [
        { c_name: { $regex: searchTerm, $options: 'i' } },
        { userMail: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Fetch filtered and sorted partners
    const partners = await partner.find(query).sort({ [sort]: order });

    // Count total partners
    const totalpartners = await partner.countDocuments();

    // Count partners from the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthpartners = await partner.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Response
    return res.status(200).json({
      success: true,
      partners,
      totalpartners,
      lastMonthpartners,
    });
  } catch (error) {
    next(error);
  }
};
