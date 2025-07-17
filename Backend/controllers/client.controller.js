import { errorHandler } from "../utils/error.js";
import client from "../models/client.model.js"; 


export const getallclients = async (req, res, next) => {
  try {
    const foundclient = await client.findById(req.params.id);
    if (!foundclient) {
      return next(errorHandler(404, "Client not found"));
    }
    res.status(200).json(foundclient);
  } catch (error) {
    next(error);
  }
};

export const createclient = async (req, res, next) => {
  try {
    const { company_name, description, userRef, userMail } = req.body;
    const client_image = req.file?.path;

    // Validate required fields
    if (!company_name || !description || !userRef || !userMail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!client_image) {
      return res.status(400).json({ error: "Client image is required" });
    }

    // Create new client record
    const newClient = await client.create({
      client_image,
      company_name,
      description,
      userRef,
      userMail,
    });

    return res.status(201).json({
      message: "Client created successfully",
      data: newClient,
    });
  } catch (error) {
    console.error("Create Client Error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};



export const deleteclient = async (req, res, next) =>{
    const Dclient = await client.findById(req.params.id);

    if (!Dclient) {
        return next (errorHandler(404, 'Application not found'));
    }
    if (!req.user.isAdmin && req.user.id !== Dclient.userRef.toString()) {
    return next(errorHandler(401, 'You can only update your own application!'));
}
    try {
        await client.findByIdAndDelete(req.params.id);
        res.status(200).json('Application has been deleted! ')
    } catch (error) {
        next(error);
    }
}

export const updateclient = async (req, res, next) => {
  try {
    const Uclient = await client.findById(req.params.id);
    if (!Uclient) {
      return next(errorHandler(404, "Client not found"));
    }
    if (!req.user.isAdmin && req.user.id !== Uclient.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own client info!"));
    }

    // If new image uploaded, update client_image path
    if (req.file?.path) {
      req.body.client_image = req.file.path;
    }

    const updatedclient = await client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      client: updatedclient,
      message: "Client info updated successfully",
    });
  } catch (error) {
    next(error);
  }
};




export const getclient = async (req, res, next) => {
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

    const clients = await client.find(query).sort({ [sort]: order });

    const totalclients = await client.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthclients = await client.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res.status(200).json({
      success: true,
      clients,
      totalclients,
      lastMonthclients,
    });
  } catch (error) {
    next(error);
  }
};