import express from "express";
import { addToCart, clearCart, getMyCart, removeCartItem, updateCartQuantity } from "../controllers/cartContoller.js";
import { protect } from "../middleware/authMiddleware.js"

const cartRoutes = express.Router();


cartRoutes.post("/", protect, addToCart);
cartRoutes.get("/", protect, getMyCart);
cartRoutes.put("/:productId", protect, updateCartQuantity);
cartRoutes.delete("/:productId", protect, removeCartItem);
cartRoutes.delete("/", protect, clearCart);
export default cartRoutes;