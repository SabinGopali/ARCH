import { errorHandler } from "../utils/error.js";
import Career from "../models/career.model.js"; 

export const createCareer = async (req, res, next) => {
  try {
    const newCareer = await Career.create(req.body); 
    return res.status(201).json(newCareer);
  } catch (error) {
    next(error);
  }
};


export const deleteCareer = async (req, res, next) =>{
    const DCareer = await Career.findById(req.params.id);

    if (!DCareer) {
        return next (errorHandler(404, 'Application not found'));
    }
    if ( !req.user.isAdmin && req.user.id !== application.userRef.toString()) {
        return next(errorHandler(401, 'You can only delete your own applications!'));
    }
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.status(200).json('Application has been deleted! ')
    } catch (error) {
        next(error);
    }
}

export const updateCareer = async (req, res, next) =>{
    const UCareer = await Career.findById(req.params.id);
    if (!UCareer) {
        return next (errorHandler(404, 'Post not found'));
    }
    if (!req.user.isAdmin && req.user.id !== application.userRef) {
        return next(errorHandler(401, 'You can only update your own application!'));
    }

    try {
        const updatedCareer = await Career.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCareer);
    } catch (error) {
        next(error)
    }
}




export const getCareer = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = {};

    // Search by position or userMail (adjusted based on your schema)
    if (searchTerm) {
      query.$or = [
        { position: { $regex: searchTerm, $options: 'i' } },
        { userMail: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Fetch filtered and sorted careers
    const careers = await Career.find(query).sort({ [sort]: order });

    // Count total careers
    const totalCareers = await Career.countDocuments();

    // Count careers from the last month
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthCareers = await Career.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Response
    return res.status(200).json({
      success: true,
      careers,
      totalCareers,
      lastMonthCareers,
    });
  } catch (error) {
    next(error);
  }
};
