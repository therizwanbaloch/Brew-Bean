import express from "express";
import { cancelOrder, getMyOrders, placeOrder } from "../controllers/orderControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();

orderRoutes.post("/", protect, placeOrder);

orderRoutes.get("/my-orders", protect, getMyOrders);

orderRoutes.put("/:id/cancel", protect, cancelOrder);


export default orderRoutes;

