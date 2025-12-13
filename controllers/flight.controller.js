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
    // Normalize travelClass values to canonical enum values used by the model
    const normalizeTravelClass = (value) => {
        if (!value) return value;
        const v = value.toString().trim().toLowerCase();
        if (v === 'first' || v === 'first class' || v === 'first_class' || v === 'first-class') return 'First Class';
        if (v === 'business' || v === 'business class' || v === 'business_class' || v === 'business-class') return 'Business';
        if (v === 'premium economy' || v === 'premium' || v === 'premium_economy' || v === 'premium-economy') return 'Premium Economy';
        if (v === 'economy' || v === 'eco' || v === 'econ') return 'Economy';
        // fallback to original value converted to string-cased title
        return value;
    };

    const normalizedTravelClass = normalizeTravelClass(travelClass);
    const allowedClasses = ["Economy", "Premium Economy", "Business", "First Class"];
    if (!allowedClasses.includes(normalizedTravelClass)) {
        throw new ApiError(400, `Invalid travel class: ${travelClass}`);
    }

    const flightDoc = new Flight({
        user: req.user._id,
        fromCity,
        toCity,
        departureDate,
        returnDate,
        travelClass: normalizedTravelClass,
        passengers,
        price,
        airline
    });
    await flightDoc.save();
    return res.status(201).json(new ApiResponse(201, flightDoc, "Flight booking created successfully"));
});

export { flight };
