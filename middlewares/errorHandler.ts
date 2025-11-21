import { NextFunction, Request,Response } from "express"

interface CustomError extends Error{
    status?:number;
}

const errorHandler = (err:CustomError, req:Request, res:Response,next:NextFunction) => {
    const statusCode = err.status || 500;

    let message;

    switch (statusCode) {
        case 400:
            message = err.message || "Bad request";
            break;
        case 401:
            message = err.message || "Unauthorized";
            break;
        case 403:
            message = err.message || "Forbidden";
            break;
        case 404:
            message = err.message || "Not found";
            break;
        case 500:
            message = err.message || "Server error";
            break;
        default:
            message = err.message || "Something went wrong";
    }

    return res.status(statusCode).json({
        success:false,
        message
    })
}

export default errorHandler;