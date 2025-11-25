import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const authorizeRoles = (...roles) => {
    return (req,_,next) => {
        if(!req.user){
            throw new ApiError(401,"Unauthorized Access!")
        }

        if(!roles.includes(req.user.role)){
            throw new ApiError(403,"You are not authorized to access this resource")
        }

        next()
    }
}