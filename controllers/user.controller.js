import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // password bhi hai mongo me but yaha ham de nahi rahe yaha bas refreshtoken de rahe isliye validation false

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating access and refresh token:", error);
    throw new ApiError(
      500,
      "Something went wrong while genrating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
  console.log("REGISTER REQ BODY:", req.body);

  if (
    [userName, email, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    userName: userName.toLowerCase(),
    email: email.toLowerCase(),
  });
  if (existedUser) {
    throw new ApiError(400, "User already exists with this username or email");
  }
  const user = new User({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    userName: userName.toLowerCase(),
    email: email.toLowerCase(),
    password: password.trim(),
  });
  await user.save();

  const createdUser = await User.findById(user._id).select("-password");
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!(userName || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // console.log("Stored :",user.password); // should be a bcrypt hash

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

 const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: "None",  
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }),
      "User logged in Successfully"
    );
});
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, { user }));
});

const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken || req.body.accessToken;
  const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", 
  sameSite: "None", 
  maxAge: 7 * 24 * 60 * 60 * 1000,
};


  if (!token || !req.user) {
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"));
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );


  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
export { registerUser, loginUser, refreshAccessToken, logoutUser, getCurrentUser };
