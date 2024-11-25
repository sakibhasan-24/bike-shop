import express from "express";
const app = express();
import cors from "cors";
import { bikeRoutes } from "./app/modules/Products/products.routes";
import { orderRoutes } from "./app/modules/orders/orders.routes";
// const port = 3000;
app.use(express.json());
app.use(cors());
app.use((req, res) => {
  res.status(200).json({
    status: true,
    message: "welcome our bike shop server",
  });
});
app.use("/api", bikeRoutes);
app.use("/api", orderRoutes);

export default app;
