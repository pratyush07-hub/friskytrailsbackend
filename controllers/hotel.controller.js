import { HotelBooking } from "../models/hotelBooking.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const hotelBooking = asyncHandler(async (req, res) => {
    const { city, property, checkInDate, checkOutDate, guests, price } = req.body;
    if (
        [city, property, checkInDate, checkOutDate, guests].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Required fields are missing");
    }
    const hotelBooking = new HotelBooking({
        user: req.user._id,
        city,
        property,
        checkInDate,
        checkOutDate,
        guests,
        price
    });
    await hotelBooking.save();
    return res.status(201).json(new ApiResponse(201, hotelBooking, "Hotel booking created successfully"));
});

export { hotelBooking };
