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
  },
  {
    timestamps: true,
  }
);

//hash the password before saving it in the database
userModel.pre("save", async function (next) {
  const user = this as TUser;
  const hashedPassword = bcrypt.hashSync(user.password);
  user.password = hashedPassword;
  next();
});

//compare the password
userModel.methods.comparePassword = async function (password: string) {
  const user = this as TUser;
  return bcrypt.compareSync(password, user.password);
};
const User = model<TUser>("User", userModel);
export default User;
