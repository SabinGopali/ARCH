import mongoose from "mongoose";

const mediaFolderSchema = new mongoose.Schema(
  {
    userRef: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    path: {
      // Public URL path, e.g. /uploads/media/<userRef>/<slug>
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

mediaFolderSchema.index({ userRef: 1, slug: 1 }, { unique: true });

const MediaFolder = mongoose.model("media_folder", mediaFolderSchema);

export default MediaFolder;