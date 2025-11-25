import { User } from "../models/user.models.js";
import { Incident } from "../models/incident.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


export const getLeastLoadedSupportAgent = async (role,department) => {
    const supportEmployees = await User.find({
        role: role,
        department:department
    }).select("_id");

    if(supportEmployees.length===0){
        throw new ApiError(400,"no support user exist for this department!");
    }

    const loadMap = new Map();
    for(const user of supportEmployees){
        const count = await Incident.countDocuments({
            assignedTo: user._id,
            status: {
                $in: ["open", "in-progress"]
            }
        })

        loadMap.set(user._id.toString(),count);
    }

    let minUser = null;
    let minCount = Infinity;

    for(const [userId,count] of loadMap.entries()){
        if(count<minCount){
            minCount=count;
            minUser=userId;
        }
    }
    return minUser;
}