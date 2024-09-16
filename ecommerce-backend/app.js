const express=require('express');
const app=express();
const cookieParser=require('cookie-parser')

// parser
app.use(express.json());
app.use(cookieParser());

// importing routes
const product=require("./routes/productRoute")
app.use('/api/v1',product);
const user=require('./routes/userRoute');
app.use('/api/v1',user);
const order=require('./routes/orderRoute');
app.use('/api/v1',order);

// middlewares for error
const errorMiddleware=require("./middlewares/error")
app.use(errorMiddleware);

module.exports=app