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
  const result = await Bike.findOne({ _id: id });
  console.log(id, "ser");
  if (!result) {
    throw new Error("Bike not found");
  }
  return result;
};
const deleteProductFromDb = async (id: string) => {
  const alreadyDeleted = await Bike.findById(id);
  if (alreadyDeleted?.isDeleted as boolean) {
    throw new Error("Bike already deleted");
  }
  const result = await Bike.findByIdAndUpdate(id, { isDeleted: true });
  return result;
};
const updateProductInDb = async (id: string, data: object) => {
  const result = await Bike.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  console.log(result, "result");
  return result;
};
export const productService = {
  createProductsInDb,
  getProductDataFromDb,
  getroductByIdFromDb,
  deleteProductFromDb,
  updateProductInDb,
};
