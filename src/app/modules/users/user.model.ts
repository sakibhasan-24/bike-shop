import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcryptjs";
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
    role: {
      type: String,
      default: "customer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//hash the password before saving it in the database
userModel.pre("save", async function (next) {
  const user = this as any;
  if (!user.isModified("password")) return next();
  const hashedPassword = bcrypt.hashSync(user.password, 12);
  user.password = hashedPassword;
  next();
});

const User = model<TUser>("User", userModel);
export default User;
