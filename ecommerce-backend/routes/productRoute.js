const express = require("express");

const router = express.Router();

// controllers
const {
  getProductDetails,
  deleteProduct,
  getAllProducts,
  createProduct,
  updateProduct,
  createReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// routes
router.get("/product", getAllProducts);

router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  createProduct
);
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct
);

router.get("/product/:id", getProductDetails);
router.post('/product/review',isAuthenticatedUser,createReview);
router
.get('/product/reviews',getProductReviews)
.delete('/product/reviews',isAuthenticatedUser,deleteReview);

module.exports = router;
