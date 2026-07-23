import Cart from "../modals/Cart.js";
import Product from "../modals/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, size, customizations, quantity } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product and size are required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isAvailable) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const selectedSize = product.sizes.find(
      (item) => item.name === size
    );

    if (!selectedSize) {
      return res.status(400).json({
        success: false,
        message: "Invalid size selected.",
      });
    }

    let totalPrice = selectedSize.price;

    if (customizations && customizations.length > 0) {
      customizations.forEach((customization) => {
        const option = product.customizations.find(
          (item) => item.name === customization
        );

        if (option) {
          totalPrice += option.price;
        }
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: product._id,
        size,
        customizations: customizations || [],
        quantity: quantity || 1,
        price: totalPrice,
      });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    await cart.populate("items.product", "name slug images");

    return res.status(200).json({
      success: true,
      message: "Item added to cart.",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





/// get user cart

export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate(
      "items.product",
      "name slug images stock isAvailable"
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalPrice: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// update cart quantity////////////////


export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    await cart.populate("items.product", "name slug images");

    return res.status(200).json({

      success: true,
      message: "Cart updated successfully.",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// delet item from cart////////////


export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// clear cart //////

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



