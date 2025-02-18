import mongoose from "mongoose";

import app from "./app";
import config from "./app/config";

async function main() {
  await mongoose.connect(config.DBURL as string);
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}
main();

// src/app/modules/products/products.service.ts
//install cloudinary
//install jwt
//install bcrypt
