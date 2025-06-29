"use strict";
// import cloudinary from "cloudinary";
// import config from "../app/config";
// import multer from "multer";
// import fs from "fs";
// cloudinary.v2.config({
//   cloud_name: config.CLOUDINARY_API_KEY_NAME,
//   api_key: config.CLOUDINARY_API_KEY,
//   api_secret: config.CLOUDINARY_API_KEY_SECRET,
// });
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendImageToCloudinary = exports.upload = void 0;
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
const cloudinary_1 = __importDefault(require("cloudinary"));
const config_1 = __importDefault(require("../app/config"));
const multer_1 = __importDefault(require("multer"));
const stream_1 = require("stream");
cloudinary_1.default.v2.config({
    cloud_name: config_1.default.CLOUDINARY_API_KEY_NAME,
    api_key: config_1.default.CLOUDINARY_API_KEY,
    api_secret: config_1.default.CLOUDINARY_API_KEY_SECRET,
});
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
const sendImageToCloudinary = (imageName, buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.v2.uploader.upload_stream({ public_id: imageName, folder: "bike_images" }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
        const readableStream = new stream_1.Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(stream);
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
