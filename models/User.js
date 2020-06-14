const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    acceptedInvs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invitation",
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
userSchema.virtual("invitations", {
  ref: "Invitation",
  localField: "_id",
  foreignField: "creator",
});
userSchema.virtual("accepted", {
  ref: "Invitation",
  localField: "acceptedInvs",
  foreignField: "_id",
});
userSchema.set("toObject", { virtuals: true });
const User = mongoose.model("User", userSchema);
module.exports = User;
