import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

//you have to make one more controller for deactivating user becuz of isActive field
const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,role, department} = req.body;

    if([name,email,password,role,department].some((field) => field.trim() === "")){
        throw new ApiError(401,"All fields are mandatory!")
    }

    const isAdmin = (await User.countDocuments()) === 0;  //if there are no users then the first user becomes admin

    const existedUser = await User.findOne({email})
    if(existedUser){
        throw new ApiError(402,"User already exists!")
    }

    const user = await User.create({
        name,
        email,
        password,
        role: isAdmin ? "admin" : role,
        department
    })

    const createdUser = await User.findById(user._id).select("-password")

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering user!")
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            isAdmin ? "First user registered as Admin successfully!" : "User registered successfully!"
        )
    )
})

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
const loginUser = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) throw new ApiError(401,"All fields are required!")

    const existedUser = await User.findOne({email})
    if(!existedUser){
        throw new ApiError(401,"no user exists with this email!")
    }
    
    const isPasswordCorrect = await existedUser.isPasswordCorrect(password)
    if(!isPasswordCorrect) throw new ApiError(402,"Invalid credentials!")
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(existedUser._id)

    const loggedInUser = await User.findById(existedUser._id).select("-refreshToken -password")
    if(!loggedInUser) throw new ApiError(500,"something went wrong while logging you in")

    const options = {    //
        httpOnly: true,
        secure: true,
        sameSite: "none"  // Changed to "none" for cross-origin (Vercel to Render)
    }

    return res.
        status(200).
        cookie("accessToken", accessToken, options).
        cookie("refreshToken", refreshToken, options).
        json(
            new ApiResponse(
                200,
                loggedInUser,
                "User logged in Successfully!"
            )
        )

})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: ""   //it should not be undefined
            }
        },
        {
            new: true
        }
    )

    const options= {
        httpOnly: true,
        secure: true,
        sameSite: "none"  // Changed to "none" for cross-origin (Vercel to Render)
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out successfully!"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {    // this api is yet to check in auth controller
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) throw new ApiError(401, "Invalid refresh token");

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token expired or used");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"  // Changed to "none" for cross-origin (Vercel to Render)
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access Token refreshed!"
                )
            );
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
});

export { registerUser, generateAccessAndRefreshToken, loginUser, logoutUser, refreshAccessToken }
