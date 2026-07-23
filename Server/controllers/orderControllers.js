import Order from "../modals/Order.js";
import Cart from "../modals/Cart.js";

export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: cart.items,
      totalPrice: cart.totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || "Cash on Delivery",
    });

    // Clear cart after successful order
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    const createdOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name slug images");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/// get my orderss


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product", "name slug images")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Only order owner can cancel
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.orderStatus.toLowerCase()}.`,
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

