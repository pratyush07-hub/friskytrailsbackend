import { BusTicket } from "../models/busTicket.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const busTicket = asyncHandler(async (req, res) => {
    const { fromCity, toCity, departureDate, returnDate, passengers, price } = req.body;
    if (
        [fromCity, toCity, departureDate, passengers].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Required fields are missing");
    }
    const busTicket = new BusTicket({
        user: req.user._id,
        fromCity,
        toCity,
        departureDate,
        returnDate,
        passengers,
        price
    });
    await busTicket.save();
    return res.status(201).json(new ApiResponse(201, busTicket, "Bus ticket booked successfully"));
});

export { busTicket };
