import { Adventure } from "../models/adventure.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adventure = asyncHandler(async (req, res) => {
    const { fromCity, toCity, duration, budget , date, guests } = req.body;
    if (
        [fromCity, toCity, duration, budget, date, guests].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }
    const adventure = new Adventure({
        user: req.user._id, 
        fromCity,
        toCity,
        duration,
        budget,
        date,
        guests
    });
    await adventure.save();
    return res.status(201).json(new ApiResponse(201, adventure, "Adventure information taken successfully"));
});

export { adventure };