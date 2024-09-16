const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handling wrong MongoDb Id error mtlb api url me tumne kuch glti krdi
  //  , more Generalised CAST ERROR
  if (err.name === "CastError") {
    const message = `Resources not Found. Invalid:${err.path}:${err.value}`;
    err = new ErrorHandler(message, 404);
  }
  // mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)[0]} entered`;
    err = new ErrorHandler(message, 400);
  }
  // wrong json web token
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid,try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT expire error
  if (err.name === "TokenExpiredError") {
    const message = `Token is expired ,Please login again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
