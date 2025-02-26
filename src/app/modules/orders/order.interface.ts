type TOrderProduct = {
  product: string;
  quantity: number;
  price: number;
};

type TOrder = {
  email: string;
  products: TOrderProduct[];
  totalPrice: number;
  phone: string;
  address: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
};

export default TOrder;
