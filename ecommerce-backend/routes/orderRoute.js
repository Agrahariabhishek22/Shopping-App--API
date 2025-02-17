const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/order/new", isAuthenticatedUser, newOrder);
router.get(
  "/order/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getSingleOrder
);
router.get("/orders/me", isAuthenticatedUser, myOrders);

router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllOrders
);

router
  .put(
    "/admin/order/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    updateOrder
  )
  .delete(
    "/admin/order/:id",
    isAuthenticatedUser,
    authorizeRoles("admin"),
    deleteOrder
  );

module.exports = router;
