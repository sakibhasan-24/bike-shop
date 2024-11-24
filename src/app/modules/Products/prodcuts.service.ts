import TProducts from "./products.interface";
import Bike from "./products.model";

const createProductsInDb = async (product: TProducts) => {
  const bikeResult = new Bike(product);
  const result = await bikeResult.save();
  return result;
};
const getProductDataFromDb = async (searchTerm = {}) => {
  const result = await Bike.find(searchTerm);
  return result;
};

const getroductByIdFromDb = async (id: string) => {
  const result = await Bike.findById(id);
  console.log(id, "ser");
  if (!result) {
    throw new Error("Bike not found");
  }
  return result;
};

export const productService = {
  createProductsInDb,
  getProductDataFromDb,
  getroductByIdFromDb,
};
