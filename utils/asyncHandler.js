const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
    }
    catch (error) {
        console.error("Caught Error:", error);
        
        // Handle ApiError instances properly
        const statusCode = error.statusCode || error.code || 500;
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