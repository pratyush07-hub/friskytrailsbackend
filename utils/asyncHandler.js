const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
    }
    catch (error) {
        console.error("Caught Error:", error);
        
        // Handle ApiError and common DB/JWT errors properly
        let statusCode = 500;
        if (typeof error.statusCode === 'number' && error.statusCode >= 100 && error.statusCode < 1000) {
            statusCode = error.statusCode;
        } else if (error.code === 11000 || error.name === 'MongoServerError') {
            statusCode = 409;
        } else if (error.name === 'ValidationError' || error.name === 'CastError') {
            statusCode = 400;
        } else if (error.name === 'JsonWebTokenError' || error.name === 'UnauthorizedError') {
            statusCode = 401;
        }
        const message = error.message || "Something went wrong";
        const errors = error.errors || [];
        
        res.status(statusCode).json({
            success: false,
            message: message,
            errors: errors,
            ...(error.data && { data: error.data })
        })
    }
}

export { asyncHandler }