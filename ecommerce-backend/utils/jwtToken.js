// creating token and saving it in cookies
 
require('dotenv').config();

const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();

    // creating options for cookies
    const option={
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true
    }
    
    res.status(statusCode).cookie('token',token,option).json({
        success:true,
        token,
        user,
    })
}

module.exports=sendToken;