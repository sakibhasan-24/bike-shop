import TProducts from "./products.interface";
import Bike from "./products.model";

const createProductsInDb = async (product: TProducts) => {
  // business logic...(add,remove....)
  const bikeResult = new Bike(product);
  const result = await bikeResult.save();
  return result;
};

export const productService = {
  createProductsInDb,
};
