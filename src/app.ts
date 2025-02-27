import express from "express";
const app = express();
import cors from "cors";
import { bikeRoutes } from "./app/modules/Products/products.routes";
import { orderRoutes } from "./app/modules/orders/orders.routes";
import globalErrorHandler from "./middlewares/errorHandler";
import { userRoutes } from "./app/modules/users/user.routes";
import cookieParser from "cookie-parser";
import { paymentRoute } from "./app/modules/payment/payment.routes";
// const port = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api", bikeRoutes);
app.use("/api", orderRoutes);
app.use("/api", userRoutes);
app.use("/api", paymentRoute);

app.use(globalErrorHandler);
export default app;
