import mongoose from "mongoose";

const userLibrarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "want-to-read",
        "currently-reading",
        "completed",
      ],
      default: "want-to-read",
    },
  },
  {
    timestamps: true,
  }
);

const UserLibrary =mongoose.model("UserLibrary", userLibrarySchema);

export default UserLibrary;