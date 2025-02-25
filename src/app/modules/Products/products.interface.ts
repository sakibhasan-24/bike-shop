enum BikeCategory {
  Mountain = "Mountain",
  Road = "Road",
  Hybrid = "Hybrid",
  Electric = "Electric",
}

export type TReview = {
  user: string;
  rating: number;
  text?: string;
};

type TProducts = {
  name: string;
  brand: string;
  price: number;
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted?: boolean;
  category: BikeCategory;
  reviews?: TReview[];
  averageRating?: number;
  image: string;
};

export default TProducts;
