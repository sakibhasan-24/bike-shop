import express from "express";
const app = express();
import cors from "cors";
import { bikeRoutes } from "./app/modules/Products/products.routes";
import { orderRoutes } from "./app/modules/orders/orders.routes";
import globalErrorHandler from "./middlewares/errorHandler";
// const port = 3000;
app.use(express.json());
app.use(cors());

app.use("/api", bikeRoutes);
app.use("/api", orderRoutes);

app.use(globalErrorHandler);
export default app;
