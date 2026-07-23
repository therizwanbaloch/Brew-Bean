import mongoose from "mongoose";
import slugify from "slugify";

import Product from "../modals/Product.js";
import Category from "../modals/Category.js";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      images,
      sizes,
      customizations,
      stock,
      preparationTime,
      featured,
      isAvailable,
    } = req.body;

    // Required fields
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and category are required.",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    // Find category
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    // Check category status
    if (!existingCategory.isActive) {
      return res.status(400).json({
        success: false,
        message: "Category is inactive.",
      });
    }

    // Generate slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // Check duplicate
    const productExists = await Product.findOne({
      $or: [{ name }, { slug }],
    });

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists.",
      });
    }

    // Create Product
    const product = await Product.create({
      name,
      slug,
      description,
      category: existingCategory._id,
      images: images || [],
      sizes: sizes || [],
      customizations: customizations || [],
      stock: stock ?? 0,
      preparationTime: preparationTime ?? 10,
      featured: featured ?? false,
      isAvailable: isAvailable ?? true,
    });

    // Populate Category
    const createdProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





// get alll productsssssssssss


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




////// get product by sluggggggggggggggggg


export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      isAvailable: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product By Slug Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






///// update products


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      name,
      description,
      category,
      images,
      sizes,
      customizations,
      stock,
      preparationTime,
      featured,
      isAvailable,
    } = req.body;

    // Validate category if provided
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID.",
        });
      }

      const existingCategory = await Category.findOne({
        _id: category,
        isActive: true,
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      product.category = category;
    }

    // Update name & slug
    if (name && name !== product.name) {
      const slug = slugify(name, {
        lower: true,
        strict: true,
      });

      const duplicate = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another product with this name already exists.",
        });
      }

      product.name = name;
      product.slug = slug;
    }

    if (description !== undefined) product.description = description;
    if (images !== undefined) product.images = images;
    if (sizes !== undefined) product.sizes = sizes;
    if (customizations !== undefined) product.customizations = customizations;
    if (stock !== undefined) product.stock = stock;
    if (preparationTime !== undefined)
      product.preparationTime = preparationTime;
    if (featured !== undefined) product.featured = featured;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate(
      "category",
      "name slug"
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



////// delete productss


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    product.isAvailable = false;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




///// get features products 


export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      featured: true,
      isAvailable: true,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Featured Products Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// get lates products 


export const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isAvailable: true,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(8);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Latest Products Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






/////// search product 


export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await Product.find({
      isAvailable: true,
      name: {
        $regex: keyword || "",
        $options: "i",
      },
    }).populate("category", "name slug");

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Search Product Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





///// filter productssss


export const filterProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = "latest",
    } = req.query;

    let query = {
      isAvailable: true,
    };

    if (category) {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (minPrice || maxPrice) {
      query["sizes.price"] = {};

      if (minPrice) query["sizes.price"].$gte = Number(minPrice);

      if (maxPrice) query["sizes.price"].$lte = Number(maxPrice);
    }

    let sortOption = {};

    switch (sort) {
      case "latest":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "name":
        sortOption = { name: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



