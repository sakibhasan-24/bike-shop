// import cloudinary from "cloudinary";
// import config from "../app/config";
// import multer from "multer";
// import fs from "fs";
// cloudinary.v2.config({
//   cloud_name: config.CLOUDINARY_API_KEY_NAME,
//   api_key: config.CLOUDINARY_API_KEY,
//   api_secret: config.CLOUDINARY_API_KEY_SECRET,
// });

// export const sendImageToCloudinary = (imageName: string, path: string) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       path,
//       { public_id: imageName },
//       function (error: any, result: any) {
//         if (error) {
//           reject(error);
//         }
//         resolve(result);
//         // delete a file asynchronously
//         fs.unlink(path, (err) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log("File is deleted.");
//           }
//         });
//       }
//     );
//   });
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, process.cwd() + "/uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix);
//   },
// });

// export const upload = multer({ storage: storage });
import cloudinary from "cloudinary";
import config from "../app/config";
import multer from "multer";
import { Readable } from "stream";

cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_API_KEY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_KEY_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const sendImageToCloudinary = (imageName: string, buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { public_id: imageName, folder: "bike_images" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(stream);
  });
};
