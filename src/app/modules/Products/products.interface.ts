enum BikeCategory {
  Mountain = "Mountain",
  Road = "Road",
  Hybrid = "Hybrid",
  Electric = "Electric",
}

type TProducts = {
  name: string;
  brand: string;
  price: number;
  description: string;
  quantity: number;
  inStock: boolean;
  category: BikeCategory;
};

export default TProducts;
