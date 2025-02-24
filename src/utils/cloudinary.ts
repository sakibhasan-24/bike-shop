import cloudinary from "cloudinary";
import config from "../app/config";

cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_API_KEY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_KEY_SECRET,
});

export const uploadToCloudinary = async (image: string) => {
  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "bikes",
      use_filename: true,
      unique_filename: false,
    });

    return result;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};
