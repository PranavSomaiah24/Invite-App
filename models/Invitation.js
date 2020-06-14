const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const invitationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    accept: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      //   required: true,
      ref: "User",
    },
    acceptees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
const Invitation = mongoose.model("Invitation", invitationSchema);
module.exports = Invitation;
