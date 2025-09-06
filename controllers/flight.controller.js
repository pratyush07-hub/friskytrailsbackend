import { Flight } from "../models/flights.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const flight = asyncHandler(async (req, res) => {
    const { fromCity, toCity, departureDate, returnDate, travelClass, passengers, price, airline } = req.body;
    if (
        [fromCity, toCity, departureDate, travelClass, passengers].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Required fields are missing");
    }
    const flight = new Flight({
        user: req.user._id,
        fromCity,
        toCity,
        departureDate,
        returnDate,
        travelClass,
        passengers,
        price,
        airline
    });
    await flight.save();
    return res.status(201).json(new ApiResponse(201, flight, "Flight booking created successfully"));
});

export { flight };
