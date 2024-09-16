const mongoose =require('mongoose');

const productSchema=new mongoose.Schema({
       name:{
              type:String,
              required:[true,"Please enter Product name"]
       },
       description:{
              type:String,
              required:[true,"Please enter Product Description"]
       },
       price:{
              type:Number,
              required:[true,"Please Enter product Price"],
              maxLength:[8,"Price cannot exceed 8 characters"]
       },
       ratings:{
              type:Number,
              default:0
       },
       images:[
              {
                     public_id:{
                            type:String,
                            required:true
                     },
                     url:{
                            type:String,
                            required:true
                     }
              }
       ],
       category:{
              type:String,
              required:[true,"Please enter product Category"]
       },
       stock:{
              type:Number,
              default:1,
              required:[true,"Please enter required Stack"],
              maxLength:[4,"Please do not exceed 4 chracters"]
       },
       numOfReview:{
              type:Number,
              default:0
       },
       reviews:[
              {
                     user:{
                            type:mongoose.Schema.ObjectId,
                            ref:"User",
                            required:true,
                     },
                     name:{
                            type:String,
                            required:true,
                     },
                     rating:{
                            type:Number,
                            required:true,
                     },
                     comment:{
                            type:String,
                            required:true,
                     }
              }
       ],
       user:{
              type:mongoose.Schema.ObjectId,
              ref:"User",
              required:true,
       },
       createdAt:{
              type:Date,
              default:Date.now,
       }
})

module.exports=mongoose.model("Product",productSchema);