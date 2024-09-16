const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

require("dotenv").config();

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to access the resources", 401));
  }
  // console.log(token)
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Data:", decodedData);
    req.user = await User.findById(decodedData.id);
    // console.log("User:", req.user);
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
