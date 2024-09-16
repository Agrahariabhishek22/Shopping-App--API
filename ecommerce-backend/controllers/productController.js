const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const mongoose = require("mongoose");
const catchAsyncError = require("../middlewares/catchAsyncError");

// create product--Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    message: "New Product Created Successfully",
    product,
  });
});

// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;
  // count number of product
  // countDocuments() is a mongoose method to count all the object in the query
  const productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // console.log(req.query);

  const products = await apiFeature.query;
  // const products = await Product.find();
  return res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

// get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  // Validate if ID is in valid format
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorHandler("Invalid product ID format", 400));
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product do not exist", 404));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

// update product--Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product do not Found", 500));
    }
    await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    console.log("Error in updating product");
  }
};

// Delete Products
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product do not exist to delete",
      });
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    console.log("Error while deleting");
  }
};

// create new review or update review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, product_id } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(product_id);
  if (!product) {
    return next(new ErrorHandler("Product Doesnt exist to review", 400));
  }
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReview = product.reviews.length;
  }
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Product reviewed successfully",
  });
});

// get all reviews of a product
exports.getProductReviews = async (req, res, next) => {
  console.log(req.query.id);
  console.log("query.id");
  // const productId = req.query.id;

  // if (!productId) {
  //   return next(new ErrorHandler("Product ID is required", 400));
  // }
  // if (!mongoose.Types.ObjectId.isValid(productId)) {
  //   return next(new ErrorHandler("Invalid product ID format", 400));
  // }

  // try {
  //   const product = await Product.findById(req.query.id);
  //   if (!product) {
  //     return next(
  //       new ErrorHandler("Product Doesnt exist to show reviews", 400)
  //     );
  //   }

  //   res.status(200).json({
  //     success: true,
  //     reviews: product.reviews,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   console.log("Error a gya");
    
  // }
};

// delete review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const productId = req.query.productid;
  const reviewId = req.query.id;

  if (!productId || !reviewId) {
    return next(new ErrorHandler("Product ID and Review ID are required", 400));
  }

  const product = await Product.findById(productId);
  console.log("enter1");

  if (!product) {
    return next(new ErrorHandler("Product doesn't exist", 404));
  }

  const reviews = product.reviews.filter((rev) => {
    return rev._id.toString() !== reviewId.toString();
  });

  let avg = 0;
  if (reviews.length > 0) {
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
    avg = avg / reviews.length;
  }

  const numOfReview = reviews.length;
  console.log("enter2");

  await Product.findByIdAndUpdate(
    productId,
    {
      reviews,
      ratings: avg,
      numOfReview,
    },
    {
      new: true,
      runValidators: true, 
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    reviews,
  });
});
