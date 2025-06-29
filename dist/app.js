"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const products_routes_1 = require("./app/modules/Products/products.routes");
const orders_routes_1 = require("./app/modules/orders/orders.routes");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const user_routes_1 = require("./app/modules/users/user.routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const payment_routes_1 = require("./app/modules/payment/payment.routes");
// const port = 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://moto-mart-frontend.vercel.app",
        "https://moto-mart-6pb7fbyn6-sakib-hasans-projects.vercel.app/",
    ],
    credentials: true,
}));
app.use("/api", products_routes_1.bikeRoutes);
app.use("/api", orders_routes_1.orderRoutes);
app.use("/api", user_routes_1.userRoutes);
app.use("/api", payment_routes_1.paymentRoute);
app.use(errorHandler_1.default);
exports.default = app;
