import { User } from "../models/user.models.js";
import { Incident } from "../models/incident.models.js";
import { ApiError } from "../utils/ApiError.js";


export const getLeastLoadedSupportAgent = async (role,department) => {
    const supportEmployees = await User.find({
        role: role,
        department:department
    });

    if(supportEmployees.length===0){
        throw new ApiError(400,"no support user exist for this department!");
    }

    let minUser = null;
    let minCount = Infinity;

    for(const user of supportEmployees){
        const count = await Incident.countDocuments({
            assignedTo: user._id,
            status: {
                $in: ["open", "in-progress"]
            }
        })

        if(count < minCount){
            minCount = count;
            minUser = user;  // store full user object
        }
    }
    return minUser;  // return User document, not id
}