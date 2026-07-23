import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import {
  getAllOrders,
  updateOrderStatus,
  getDashboard,
  getDashboardAnalytics,
  getDashboardActivity,
  getInventoryStatus,
} from "../controllers/adminController.js";

const adminRoutes = express.Router();

adminRoutes.use(protect, isAdmin);
adminRoutes.get("/dashboard", getDashboard);
adminRoutes.get("/dashboard/analytics", getDashboardAnalytics);
adminRoutes.get("/dashboard/activity", getDashboardActivity);
adminRoutes.get("/dashboard/inventory", getInventoryStatus);

adminRoutes.get("/orders", getAllOrders);
adminRoutes.put("/orders/:id", updateOrderStatus);

export default adminRoutes;