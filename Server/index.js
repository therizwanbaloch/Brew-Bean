import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRouter from "./Routes/authRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import reviewRoutes from "./Routes/reviewRoutes.js";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("MongoDB Connected Successfully");
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});