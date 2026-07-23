import express from "express";
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const categoryRoutes = express.Router();

categoryRoutes.post("/", protect, isAdmin, createCategory);
categoryRoutes.get("/", getCategories)
categoryRoutes.get("/:slug", getCategory);
categoryRoutes.put("/:id", protect, isAdmin, updateCategory);
categoryRoutes.delete("/:id", protect, isAdmin, deleteCategory);

export default categoryRoutes;