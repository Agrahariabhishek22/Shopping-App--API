
const Order=require('../models/orderModel');
 const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncError");

// create new order
exports.newOrder=catchAsyncErrors(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
    
    const order = await Order.create({...req.body,
        paidAt: Date.now(),
        user:req.user._id,
    });

      res.status(201).json({
        success:true,
        order,
      })
});

// get single order--ADMIN
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    console.log("enter1");
     const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .exec();
  
    console.log("enter1");
    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    res.status(200).json({
      success: true,
      order,
    });
  });


  // get logged in user orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.find({user:req.user._id});

    res.status(200).json({
      success: true,
      order,
    });
  });



//   get all orders--ADMIN
exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();
    
    let totalAmount=0;
    orders.forEach((order)=>totalAmount+=order.totalPrice)

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})


// update order status --ADMIN
exports.updateOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
      }

      if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
      }

      if(req.body.status==='Shipped'){
        order.orderItems.forEach(async(order)=>{
            await updateStock(order.product,order.quantity);
        })
      }
      order.orderStatus=req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
      }
    

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
      });
})

async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.stock-=quantity;
    await product.save({validateBeforeSave:false});
}


// delete order--ADMIN

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order=await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHander("Order not found with this Id", 404));
      }
    await  Order.deleteOne({_id:req.params.id});
    res.status(200).json({
        success: true,
      });
});
