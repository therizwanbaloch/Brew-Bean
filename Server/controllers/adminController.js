import Order from "../modals/Order.js";
import Product from "../modals/Product.js";
import User from "../modals/User.js";
import Review from "../modals/Review.js";



// get all order apis for adminnnnnn


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// update order status from admin


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Order:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// dashboard stats 


export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments({
      isAvailable: true,
    });

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const completedOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================================================
// Dashboard Analytics
// GET /api/admin/dashboard/analytics
// =======================================================

export const getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);

    const startOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday },
    });

    const weeklyOrders = await Order.find({
      createdAt: { $gte: startOfWeek },
    });

    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth },
    });

    const calculateRevenue = (orders) =>
      orders.reduce((sum, order) => sum + order.totalPrice, 0);

    const monthlyRevenue = calculateRevenue(monthlyOrders);

    res.status(200).json({
      success: true,
      analytics: {
        todaySales: calculateRevenue(todayOrders),
        weeklySales: calculateRevenue(weeklyOrders),
        monthlySales: monthlyRevenue,

        todayOrders: todayOrders.length,
        weeklyOrders: weeklyOrders.length,
        monthlyOrders: monthlyOrders.length,

        averageOrderValue:
          monthlyOrders.length > 0
            ? Math.round(monthlyRevenue / monthlyOrders.length)
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================================================
// Recent Activity
// GET /api/admin/dashboard/activity
// =======================================================

export const getDashboardActivity = async (req, res) => {
  try {

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(7);

    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(7);

    const recentReviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .limit(7);

    res.status(200).json({
      success: true,
      activity: {
        recentUsers,
        recentOrders,
        recentReviews,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =======================================================
// Inventory Overview
// GET /api/admin/dashboard/inventory
// =======================================================

export const getInventoryStatus = async (req, res) => {

  try {

    const lowStock = await Product.find({
      stock: { $gt: 0, $lte: 10 },
    })
      .select("name stock images")
      .sort({ stock: 1 });

    const outOfStock = await Product.find({
      stock: 0,
    }).select("name images");

    const featuredProducts = await Product.find({
      featured: true,
    })
      .select("name stock images")
      .limit(5);

    res.status(200).json({
      success: true,
      inventory: {
        lowStock,
        outOfStock,
        featuredProducts,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};