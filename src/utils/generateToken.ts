import jwt from "jsonwebtoken";
import config from "../app/config";

const generateToken = (user: any) => {
  const tokenPayload = {
    _id: user.id,
    role: user.role,
    email: user.email,
  };

  const token = jwt.sign(tokenPayload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRATION_TIME as any,
  });

  return token;
};

export default generateToken;
