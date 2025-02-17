import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const userModel = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model<TUser>("User", userModel);
export default User;
