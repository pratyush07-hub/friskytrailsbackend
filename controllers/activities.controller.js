
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Activity } from "../models/activities.model.js";

const activity = asyncHandler(async (req, res) => {
    const { activityType, location, date, description } = req.body;

    if (
        [activityType, location, date].some((field) =>
            field === undefined || (typeof field === 'string' && field.trim() === "")
        )
    ) {
        throw new ApiError(400, "Activity Type, Location and Date are required");
    }

    const activity = new Activity({
        user: req.user?._id,
        activityType,
        location,
        date,
        description
    });
// ensure the activity is saved to the database
    await activity.save();
    return res.status(201).json(new ApiResponse(201, activity, "Activity created successfully"));
});

export { activity };
