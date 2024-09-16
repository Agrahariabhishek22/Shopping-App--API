// extend Error means inherited the built in Error class of JS
class ErrorHandler extends Error{
    constructor(message,statusCode){
        // super(message) passes the message to the parent class Error
        // and then Error class do its job of setting up error
        // super keyword in javascript is used to call the constructor function of parent class
        // now message send as argument is stored in message property of Error object and later can be displayed
        super(message);
        // this keyword is used to refer the methods and properties of current instance of class or object 
        this.statusCode=statusCode;
        // captureStackTrace helps in debugging where exactly error happened in your code 
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=ErrorHandler;