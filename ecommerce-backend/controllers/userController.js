const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncError.js");
const User = require("../models/userModel.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

// register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "Sample_id",
      url: "njnewqjfnqk",
    },
  });

  // generated token and insert into cookie and also send response
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Kindly enter email and password", 500));
  }

  // Find user by email and explicitly select the password field
  const user = await User.findOne({ email }).select("+password");

  // Check if the user exists
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Check if the password matches
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }

  // If everything is correct, send the token
  sendToken(user, 200, res);
});

// logout
exports.logoutUser = catchAsyncErrors(async (req, res) => {
  // console.log(res.url);
  // console.log(res.cookie("token"));

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// reset password function
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const email = req.body.email;
  // console.log({email});

  const user = await User.findOne({ email });
  // console.log(user)
  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }
  // get resetpasswordtoken
  const resetToken = user.getResetPasswordToken();
  
  // tumne resetPasswordToken,resetPasswordExpire fields me data fill kr diya hai but remember
  // u didnt save these data in userSchema
  await user.save({ validateBeforeSave: false });
  // creating url where i will send email
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  // generating common message to sent in the email
  const message = `Kindly reset your password, link will be active for 15 minutes only \n\n Your Reset password link is as:\n\n ${resetPasswordUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery Mail `,
      message: message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash coming from reset password url
  const resetToken = req.params.token;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesnt match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save({ validateBeforeSave: false });

  //   now generate token and make user login
  sendToken(user, 200, res);
});

// get user details--this will help you when u make profile for user
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// change password route
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }

  const { newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  user.password = newPassword;
  await user.save();

  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we will add cloudinary later
  console.log(req.body);

  console.log(req.user);

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users for *(Admin)
exports.getAllUsers=catchAsyncErrors(async(req,res,next)=>{
  const users=await User.find();

  res.status(200).json({
    success:true,
    users
  })
})

// Get Single users for *(Admin)
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
  const user=await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler("User doesn't exist",400));
  }

  res.status(200).json({
    success:true,
    user
  })
})


// update User role by --ADMIN
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  
  // we will add cloudinary later
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidator: true,
    userFindAndModify: false,
  });

  if(!user){
    return next(new ErrorHandler("User Do not Exist",400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// Delete user by --ADMIN
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user=await User.findByIdAndDelete(req.params.id);

  if(!user){
    return next(new ErrorHandler("User Do not Exist",400));
  }
  // we will remove cloudinary later

  res.status(200).json({
    success: true,
    message:`User deleted successfully by Admin ${req.user.name}`
   });
});


