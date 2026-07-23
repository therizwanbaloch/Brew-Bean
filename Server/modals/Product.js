import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Small", "Medium", "Large"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    sizes: [sizeSchema],

    customizations: [customizationSchema],

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    preparationTime: {
      type: Number,
      default: 10,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);