const nodemailer=require('nodeMailer');
require('dotenv').config();

const sendEmail=async(options)=>{
    const transporter=nodemailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_MAIL,
            pass:process.env.SMTP_PASSWORD,
        }
    });

    const mailOptions={
        from:process.env.SMTP_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ', error.message);
        } else {
            // console.log('Email sent: ', info.response);
        }
    });
 
}


module.exports=sendEmail;
