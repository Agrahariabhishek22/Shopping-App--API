const app=require('./app');
const connectDatabase=require("./config/database");

//Handling Uncaught Exception:
process.on("uncaughtException",(err)=>{
       console.log(`Error: ${err.message}`);
       console.log((`Shutting down the server due to uncaught exception`));
       process.exit(1);
}) 

 // connect to database
 require('dotenv').config();
 connectDatabase();
const PORT=process.env.PORT||4000;


const server=app.listen(PORT,()=>{
       console.log(`Sever is Listening at PORT:${PORT}`);
})

// console.log(server);

// unhandled Promise Rejection
// in this case we want to close our server
// unhandledRejection-- is an event
// mongodb uri me kuch gadbad ho to usse caught krega
process.on("unhandledRejection",err=>{
       console.log(`Error:${err}`);
       console.log(`Shutting Down the server due to Unhandled Promise Rejection `);
       server.close(()=>{
              process.exit(1);
       })
});