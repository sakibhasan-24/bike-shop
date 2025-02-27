import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  port: process.env.PORT,
  DBURL: process.env.DBURL,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_KEY_SECRET: process.env.CLOUDINARY_API_KEY_SECRET,
  CLOUDINARY_API_KEY_NAME: process.env.CLOUDINARY_API_KEY_NAME,
  STORE_ID: process.env.STORE_ID,
  STORE_PASS: process.env.STORE_PASS,
  FURL: process.env.FRONTEND_URL,
  BACKEND_URL: process.env.BACKEND_URL,
  SSLCOMMERZ_API_URL: process.env.SSLCOMMERZ_API_URL,
  STRIPE_SECRET: process.env.STRIPE_API_SECRET,
};
