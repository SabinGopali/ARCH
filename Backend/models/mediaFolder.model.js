import mongoose from "mongoose";

const mediaFolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      default: "",
      trim: true,
    },
    ownerUserId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const MediaFolder = mongoose.model("MediaFolder", mediaFolderSchema);
export default MediaFolder;
