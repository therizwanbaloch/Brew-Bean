import express from "express";
import { changePassword, getCurrentUser, loginUser, registerUser, updateProfile } from "../controllers/authControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser)
authRouter.get("/me", protect, getCurrentUser)
authRouter.put("/profile", protect, updateProfile)
authRouter.put("/change-password", protect, changePassword)

export default authRouter;