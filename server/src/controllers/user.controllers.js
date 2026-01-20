import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Incident } from "../models/incident.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { AuditLog } from "../models/auditLog.models.js";

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})

const updateAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Path is missing")
    }
    const response = await uploadOnCloudinary(avatarLocalPath);
    
    if(!response?.secure_url){
        throw new ApiError(500,"Avatar upload failed!")
    }

    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404,"user not found, avatar upload failed")
    }

    user.avatar = response.secure_url;

    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Avatar updated successfully!"
        )
    )
})

//admin APIs
const changeRole = asyncHandler(async (req, res) => {   //by admin
    const userId = req.params.id  //whose role to be changed by admin
    const { role } = req.body
    if (!role) throw new ApiError(400, "new role is required!")

    const validRoles = ["employee", "support", "senior_support", "team_lead", "admin"]
    if (!validRoles.includes(role)) {
        throw new ApiError(402, "Invalid role!")
    }

    if (req.user.role !== "admin") {
        throw new ApiError(400, "Only admin can change role!")
    }

    const user = await User.findById(userId)
    if (!user) throw new ApiError(400, "user not found!")

    if (user.role === "admin") {
        throw new ApiError(403, " admin's role cannot be changed!")
    }

    user.role = role
    await user.save()

    const updatedUser = await User.findById(userId).select("-refreshToken -password")

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "role updated successfully")
    )
})

const assignDepartment = asyncHandler(async (req, res) => {  //by admin
    const userId = req.params.id
    const { department } = req.body

    if (req.user.role !== "admin") {
        throw new ApiError(400, "Only admin can assign department!")
    }

    if (!department) throw new ApiError(400, "Department is required!")

    const validDepartments = ["IT", "HR"]
    if (!validDepartments.includes(department)) {
        throw new ApiError(400, "Invalid Department!")
    }

    const user = await User.findById(userId)
    if (!user) throw new ApiError(403, "user not found!")

    if (user.role === "admin") throw new ApiError(403, "admin's department cannot be changed!")

    user.department = department
    await user.save()

    const updatedUser = await User.findById(userId).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Department updated successfully!")
    )
})

//admin and team_lead APIs
const getAllUsers = asyncHandler(async (req, res) => {   //note one thing that department etc field are not case-sensitive,do this later
    if (!["admin", "team_lead"].includes(req.user.role)) {
        throw new ApiError(400, "You are not authorised to view users")
    };

    const {
        role,
        department,
        isActive,
        search,
        sortBy = "createdAt",
        order = "desc",
        page = 1,
        limit = 5,
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (department) query.department = department;
    if (typeof isActive !== "undefined") query.isActive = isActive === "true"; //convert string to boolean
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const users = await User.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await User.countDocuments(query); //for pagination count

    //for fetching something always use 200 and when creating use 201
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit),
            },
            "Users fetched successfully!"
        )
    );
})

const getOverview = asyncHandler(async (req, res) => {
    if (!["admin", "team_lead"].includes(req.user.role)) throw new ApiError(400, "You are not authorized to get overview!");

    const totalIncidents = await Incident.countDocuments();
    if (totalIncidents === 0) {
        return res.status(200).json(
            new ApiResponse(
                200,
                0,
                "There are no incidents"
            )
        )
    };

    const byStatus = {
        open: await Incident.countDocuments({ status: "open" }),
        inProgress: await Incident.countDocuments({ status: "in-progress" }),
        resolved: await Incident.countDocuments({ status: "resolved" }),
        closed: await Incident.countDocuments({ status: "closed" }),
    };

    // const byCategory = {};
    // const software = await Incident.countDocuments({
    //     category: "software"
    // });
    // const hardware = await Incident.countDocuments({
    //     category: "hardware"
    // });
    // const network = await Incident.countDocuments({
    //     category: "network"
    // });
    // const other = await Incident.countDocuments({
    //     category: "other"
    // });

    // byCategory.software  = software;
    // byCategory.hardware = hardware;
    // byCategory.network = network;
    // byCategory.other = other;

    //this above comment out code can also be written like this, similiar you can do this for byStatus
    const byCategory = {
        software: await Incident.countDocuments({ category: "software" }),
        hardware: await Incident.countDocuments({ category: "hardware" }),
        network: await Incident.countDocuments({ category: "network" }),
        other: await Incident.countDocuments({ category: "other" }),
    };

    const deptAggregation = await Incident.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creator"
            }
        },
        {
            $unwind: "$creator"
        },
        {
            $group: {
                _id: "$creator.department",
                count: { $sum: 1 }
            }
        }
    ]);

    const byDepartment = {};

    deptAggregation.forEach((d) => {
        byDepartment[d._id] = d.count;
    });


    return res.status(200).json(
        new ApiResponse(200,
            {
                totalIncidents,
                byStatus,
                byCategory,
                byDepartment
            },
            "overview fetched successfully!"
        )
    )
})

const getCountByPriority = asyncHandler(async (req, res) => {
    if (!["admin", "team_lead"].includes(req.user.role)) throw new ApiError(400, "You are not authorized to get count by priority!");

    const byPriority = {
        low: await Incident.countDocuments({ priority: "low" }),
        medium: await Incident.countDocuments({ priority: "medium" }),
        high: await Incident.countDocuments({ priority: "high" }),
        critical: await Incident.countDocuments({ priority: "critical" }),
    }
    // Incident.aggregate([
    //     { $group: { _id: "$priority", count: { $sum: 1 } } }
    // ])

    return res.status(200).json(
        new ApiResponse(200, byPriority, "successfully fetched count of incidents by priority")
    );
})

const getAvgResolutionTime = asyncHandler(async (req, res) => {
    if (!["admin", "team_lead"].includes(req.user.role)) throw new ApiError(400, "You are not authorized to get avg resolution time");

    const resolvedIncidents = await Incident.find({ status: { $in: ["resolved", "closed"] }, resolvedAt: { $exists: true } });

    if (resolvedIncidents.length === 0) {
        return res.status(200).json(new ApiResponse(200, 0, "No resolved incidents to calculate average."));
    }

    const totalTime = resolvedIncidents.reduce((sum, inc) => sum + (inc.resolvedAt - inc.createdAt), 0);
    const avgResolutionTimeHours = totalTime / resolvedIncidents.length / (1000 * 60 * 60);


    return res.status(200).json(
        new ApiResponse(200, avgResolutionTimeHours, "Average Resolution time fetched successfully!")
    );
})

const getActiveAndClosedIncidents = asyncHandler(async (req, res) => {
    if (!["admin", "team_lead"].includes(req.user.role)) throw new ApiError(400, "You are not authorized to get active and close incidents");

    const activeCloseIncidents = {
        active: await Incident.countDocuments({
            status: { $in: ["open", "in-progress", "resolved"] }
        }),
        closed: await Incident.countDocuments({
            status: "closed"
        })
    }

    return res.status(200).json(
        new ApiResponse(200, activeCloseIncidents, "Successfully fetched active and closed incidents!")
    );
})

//support APIs
const getMyAssignedIncidents = asyncHandler(async (req, res) => {
    if (!["support", "senior_support", "team_lead"].includes(req.user.role)) {
        throw new ApiError(400, "You are not authorised to access assigned incidents")
    };

    const { status, priority } = req.query;
    const query = {};
    query.assignedTo = req.user._id;   //or this is also right -> const query = { assignedTo: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const incidents = await Incident.find(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .lean();   //Use .lean() for better performance (since we’re only reading data).

    if (incidents.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, incidents, "No incidents found!")
        );
    };

    return res.status(200).json(
        new ApiResponse(200, incidents, "My-assigned incidents fetched successfully!")
    );
})

const getMyEscalatedOrSlaBreached = asyncHandler(async (req, res) => {
    if (!["support", "senior_support", "team_lead"].includes(req.user.role)) {
        throw new ApiError(400, "You are not authorised to access escalated or SLA-breached incidents")
    };

    const roleLevelMap = {
        support: 0,
        senior_support: 1,
        team_lead: 2
    }
    const currentSupportLevel = roleLevelMap[req.user.role];
    const currentTime = new Date();

    const currentIncidents = await Incident.find({
        assignedTo: req.user._id,
        $or: [
            { escalationLevel: { $gt: currentSupportLevel } },
            { dueAt: { $lt: currentTime } }
        ]
    }).populate("createdBy", "name email").populate("assignedTo", "name email").lean();

    if (currentIncidents.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, currentIncidents, "No incidents found!")
        );
    };

    const escalatedFromMe = await AuditLog.find({
        action: "escalated",
        "before.assignedTo": req.user._id.toString() 
    }).distinct("incidentId");

    const escalatedIncidents = await Incident.find({
        _id: { $in: escalatedFromMe},
        $or: [
            { escalationLevel: { $gt: currentSupportLevel }},
            { dueAt: { $lt: currentTime }}
        ]
    }).populate("createdBy", "name email").populate("assignedTo", "name email").lean();

    //combine and remove duplicates
    const allIncidents = [...currentIncidents, ...escalatedIncidents];
    const allUniqueIncidents = Array.from(new Map(allIncidents.map(i => [i._id.toString(), i])).values());

    return res.status(200).json(
        new ApiResponse(200, allUniqueIncidents, "Escalated or SLA-breached incidents fetched successfully!")
    );
})

const getMyResolvedOrClosedIncidents = asyncHandler(async (req, res) => {
    if (!["support", "senior_support", "team_lead"].includes(req.user.role)) {
        throw new ApiError(400, "You are not authorised to access resolved or closed incidents");
    }

    const incidents = await Incident.find({
        $or: [
            { assignedTo: req.user._id, status: "resolved" },
            { assignedTo: req.user._id, status: "closed" }  //Closed but was previously assigned to this user
        ]
    })
        .populate("createdBy", "name email")
        .populate("assignedTo","name email")
        .lean();

    if (incidents.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No resolved or closed incidents found!")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, incidents, "Resolved or closed incidents fetched successfully!")
    );
});

// const getRecentResolved ??

const getSupportDashboard = asyncHandler(async (req, res) => {
    if (!["support", "senior_support", "team_lead"].includes(req.user.role)) {
        throw new ApiError(400, "You are not authorised to view support dashboard data");
    }

    const userId = req.user._id;
    const now = new Date();
    const baseQuery = { assignedTo: userId };

    const [
        assignedToMe,
        inProgress,
        resolved,
        slaBreached,
        byPriorityAgg,
        byCategoryAgg,
        resolvedTrendAgg,
    ] = await Promise.all([
        Incident.countDocuments(baseQuery),
        Incident.countDocuments({ ...baseQuery, status: "in-progress" }),
        Incident.countDocuments({ ...baseQuery, status: "resolved" }),
        Incident.countDocuments({
            ...baseQuery,
            dueAt: { $lt: now },
            status: { $ne: "closed" },
        }),
        Incident.aggregate([
            { $match: baseQuery },
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]),
        Incident.aggregate([
            { $match: baseQuery },
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]),
        Incident.aggregate([
            {
                $match: {
                    ...baseQuery,
                    status: { $in: ["resolved", "closed"] },
                    resolvedAt: { $exists: true },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$resolvedAt" },
                        week: { $isoWeek: "$resolvedAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.week": 1 } },
        ]),
    ]);

    const byPriority = byPriorityAgg.map(p => ({ name: p._id || "unknown", value: p.count }));
    const byCategory = byCategoryAgg.map(c => ({ name: c._id || "unknown", value: c.count }));
    const resolvedTrend = resolvedTrendAgg.map(r => ({
        week: `${r._id.year}-W${String(r._id.week).padStart(2, "0")}`,
        count: r.count,
    }));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                kpis: { assignedToMe, inProgress, resolved, slaBreached },
                byPriority,
                byCategory,
                resolvedTrend,
            },
            "Support dashboard data fetched successfully!"
        )
    );
});

export { getAllUsers, updatePassword, updateAvatar, changeRole, assignDepartment, getOverview, getCountByPriority, getAvgResolutionTime, getActiveAndClosedIncidents, getMyAssignedIncidents, getMyEscalatedOrSlaBreached, getMyResolvedOrClosedIncidents, getSupportDashboard }



