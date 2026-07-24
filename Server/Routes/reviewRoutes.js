import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addReview, deleteReview, getProductReviews } from "../controllers/reviewController.js";


const reviewRoutes = express.Router();

reviewRoutes.post("/", protect, addReview);
reviewRoutes.delete("/:id", protect, deleteReview);
reviewRoutes.get("/:productId", getProductReviews);

export default reviewRoutes;