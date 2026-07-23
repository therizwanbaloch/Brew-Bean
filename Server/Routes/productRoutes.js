import express from "express";
import {
  createProduct,
  deleteProduct,
  filterProducts,
  getFeaturedProducts,
  getLatestProducts,
  getProductBySlug,
  getProducts,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const productRoutes = express.Router();

productRoutes.get("/", getProducts);
productRoutes.get("/featured/all", getFeaturedProducts);

productRoutes.get("/latest", getLatestProducts);


productRoutes.get("/search", searchProducts);


productRoutes.get("/filter", filterProducts);


productRoutes.get("/:slug", getProductBySlug)


// Create product
productRoutes.post("/", protect, isAdmin, createProduct);

// Update product
productRoutes.put("/:id", protect, isAdmin, updateProduct);

// Soft delete product
productRoutes.delete("/:id", protect, isAdmin, deleteProduct);

export default productRoutes;