import { errorHandler } from "../utils/error.js";
import team from "../models/team.model.js"; 


export const getallteams = async (req, res, next) => {
  try {
    const foundteam = await team.findById(req.params.id);
    if (!foundteam) {
      return next(errorHandler(404, "team not found"));
    }
    res.status(200).json(foundteam);
  } catch (error) {
    next(error);
  }
};

export const createteam = async (req, res, next) => {
  try {
    const {
      Username,
      t_post,
      t_description,
      t_fblink,
      t_lnlink,
      userRef,
      userMail,
    } = req.body;

    const t_image = req.file?.path;

    // Validation
    if (!Username || !t_post || !t_description || !userRef || !userMail) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    if (!t_image) {
      return res.status(400).json({ error: "Team image is required" });
    }

    // Create team
    const newTeam = await team.create({
      Username,
      t_post,
      t_description,
      t_fblink,
      t_lnlink,
      t_image,
      userRef,
      userMail,
    });

    return res.status(201).json({
      message: "Team member created successfully",
      data: newTeam,
    });

  } catch (error) {
    console.error("Create team Error:", error.message);
    console.error("Full error stack:", error);
    return res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};





export const deleteteam = async (req, res, next) =>{
    const Dteam = await team.findById(req.params.id);

    if (!Dteam) {
        return next (errorHandler(404, 'Application not found'));
    }
    if (!req.user.isAdmin && req.user.id !== Dteam.userRef.toString()) {
    return next(errorHandler(401, 'You can only update your own application!'));
}
    try {
        await team.findByIdAndDelete(req.params.id);
        res.status(200).json('Application has been deleted! ')
    } catch (error) {
        next(error);
    }
}

export const updateteam = async (req, res, next) => {
  try {
    const Uteam = await team.findById(req.params.id);
    if (!Uteam) {
      return next(errorHandler(404, "Team not found"));
    }

    // Authorization check
    if (!req.user.isAdmin && req.user.id !== Uteam.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own team info!"));
    }

    // Prepare update data object
    const updateData = {
      ...req.body, // This includes text fields from form-data
    };

    // If a new image was uploaded, update the image field in the update data
    if (req.file?.path) {
      // Match your schema field name
      updateData.t_image = req.file.path;
    }

    const updatedTeam = await team.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      team: updatedTeam,
      message: "Team info updated successfully",
    });
  } catch (error) {
    next(error);
  }
};





export const getteam = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const query = {};

    if (searchTerm) {
      query.$or = [
        { company_name: { $regex: searchTerm, $options: "i" } },
        { userMail: { $regex: searchTerm, $options: "i" } },
      ];
    }

    const teams = await team.find(query).sort({ [sort]: order });

    const totalteams = await team.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthteams = await team.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      success: true,
      teams,
      totalteams,
      lastMonthteams,
    });
  } catch (error) {
    next(error);
  }
};