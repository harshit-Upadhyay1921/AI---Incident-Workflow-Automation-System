import { Incident } from "../models/incident.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getLeastLoadedSupportAgent } from "../services/assignment.services.js";
import { recordAuditLog } from "../utils/recordAuditLog.js";
import { getSlaDueDate, getSlaNextEscalation } from "../utils/getSlaInitials.js";
import { sendSlackNotification } from "../utils/sendSlackNotification.js";
import { classifyIncident } from "../utils/classifyIncident.js";
import { AuditLog } from "../models/auditLog.models.js";

const autoClassifyIncident = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) throw new ApiError(400, "All fields are required!");

    const userId = req.user._id
    const userDept = req.user.department
    if (!userDept) throw new ApiError(400, "User department missing, cannot create incident");

    let assignedTo = await getLeastLoadedSupportAgent("support", userDept);

    const { category, priority, status } = await classifyIncident(title, description);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                title,
                description,
                category,
                priority,
                status,
                createdBy: userId,
                assignedTo,
                assignedDept: userDept,
                escalationLevel: 0,
                nextEscalationAt: getSlaNextEscalation(priority),
                dueAt: getSlaDueDate(priority)
            },
            "Incident classified successfully!"
        )
    )
})
const createIncident = asyncHandler(async (req, res) => {
    const { title, description, category, priority, status, assignedTo, assignedDept, nextEscalationAt, dueAt } = req.body
    if ([title, description, category, priority, status, assignedTo, assignedDept, nextEscalationAt, dueAt].some((field) => field.trim() === "")) throw new ApiError(400, "All fields are required!");

    const createdIncident = await Incident.create({
        title,
        description,
        category,
        priority,
        status,
        createdBy: req.user._id,
        assignedTo,
        assignedDept,
        escalationLevel: 0,
        nextEscalationAt,
        dueAt
    });

    await recordAuditLog({
        incidentId: createdIncident._id,
        action: "created",
        changedBy: req.user._id,
        after: createdIncident
    })
    return res.status(201).json(
        new ApiResponse(
            200,
            createdIncident,
            "Incident created successfully!"
        )
    )

})

const changeAssignDeptManual = asyncHandler(async (req, res) => {   //settings //creator and admin
    const { newDept } = req.body;
    const incidentId = req.params.id;

    if (!newDept) {
        throw new ApiError(400, "new Dept is required!")
    }
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new ApiError(400, "Incident Not found!!");

    if (incident.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin" && req.user._id.toString() !== incident.assignedTo.toString()) {
        throw new ApiError(401, "You are not authorized to change assigned Department!")
    }

    if (incident.assignedDept === newDept) throw new ApiError(400, "Incident already assigned to this department!");

    const before = incident.toObject();

    incident.assignedDept = newDept;
    incident.assignedTo = await getLeastLoadedSupportAgent("support", newDept);
    incident.escalationLevel = 0;
    incident.nextEscalationAt = null;
    incident.dueAt = null;

    await incident.save();

    await recordAuditLog({
        incidentId,
        action: "updated",
        changedBy: req.user._id,
        before,
        after: incident
    })
    return res.status(200).json(
        new ApiResponse(
            200,
            incident,
            "Department reassigned successfully!"
        )
    )
})

const updateIncidentStatus = asyncHandler(async (req, res) => {   // for support agent to change status from open->in progress
    const incidentId = req.params.id;
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new ApiError(400, "incident not found!");

    if (incident.assignedTo?.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to change status");
    }
    // Only allow OPEN -> IN_PROGRESS for this controller
    if (incident.status !== "open") throw new ApiError(400, "Incident cannot be moved to in-progress");

    const before = incident.toObject();

    incident.status = "in-progress";
    await incident.save();

    await recordAuditLog({
        incidentId,
        action: "status_change",
        changedBy: req.user._id,
        before,
        after: incident
    })
    return res.status(200).json(
        new ApiResponse(200, incident, "Incident marked as in-progress")
    )

})

const markResolved = asyncHandler(async (req, res) => {  //for support only
    const incidentId = req.params.id;
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new ApiError(400, "incident not found!");

    if (incident.assignedTo?.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to resolve this incident");
    }

    if (incident.status !== "in-progress") {
        throw new ApiError(400, "Incident cannot be marked as Resolved!");
    }
    const before = incident.toObject();

    incident.status = "resolved";
    incident.resolvedAt = new Date();
    await incident.save();

    await recordAuditLog({
        incidentId,
        action: "status_change",
        changedBy: req.user._id,
        before,
        after: incident
    })

    //webhook (notification to slack from this app)
    await sendSlackNotification(
        `Incident Resolved Alert: Incident ${incident._id} assigned to ${incident.assignedTo} of assigned dept ${incident.assignedDept} has been marked resolved`
    );
    return res.status(200).json(
        new ApiResponse(200, incident, "Incident marked as Resolved!")
    )

})

const closeIncident = asyncHandler(async (req, res) => {  //settings of admin && in user also
    const incidentId = req.params.id;

    const incident = await Incident.findById(incidentId);
    if (!incident) throw new ApiError(400, "incident not found!");

    if (req.user._id.toString() !== incident.createdBy.toString() && req.user.role !== "admin") {
        throw new ApiError(403, "You are not authroized to close incident!");
    }
    if (incident.status === "closed") throw new ApiError(400, "Incident already closed!");
    if (incident.status !== "resolved" && req.user.role !== "admin") {
        throw new ApiError(400, "Incident must be resolved before closing!");
    }
    const before = incident.toObject();

    incident.status = "closed";
    await incident.save();

    await recordAuditLog({
        incidentId,
        action: "status_change",
        changedBy: req.user._id,
        before,
        after: incident
    });

    return res.status(200).json(
        new ApiResponse(200, incident, "incident closed successfully!")
    )
})

const reopenIncident = asyncHandler(async (req, res) => {  //admin //settings  
    const incidentId = req.params.id;
    const incident = await Incident.findById(incidentId);
    if (!incident) throw new ApiError(400, "Incident not found!");

    if (req.user.role !== "admin") throw new ApiError(403, "You are not authorized to reopen!");

    if (incident.status !== "closed" && incident.status !== "resolved") {
        throw new ApiError(400, "Only closed or resolved incidents can be reopened!");
    }
    const before = incident.toObject();

    incident.status = "open";
    incident.escalationLevel = 0;
    incident.nextEscalationAt = null;
    incident.dueAt = null;   //one thing to note here that after reopening inc it's resolvedAt has not been marked null, reason is that for now im not clear that what should be our approach for handling reopen inc so for now im just leaving it as it is but when while working on frontend i will reach here i will resolve this thing.

    await incident.save();

    await recordAuditLog({
        incidentId,
        action: "status_change",
        changedBy: req.user._id,
        before,
        after: incident
    });

    await sendSlackNotification(
        `Incident Re-open Alert: Incident ${incident._id} marked resolved by ${incident.assignedTo} of assigned dept. ${incident.assignedDept} has been reopened.`
    );
    return res.status(200).json(
        new ApiResponse(200, incident, "Incident reopened successfully!")
    );

})

const getAllIncidents = asyncHandler(async (req, res) => {   //incidents //admin dashboard  //team lead dashboard
    if (!["admin", "team_lead"].includes(req.user.role)) {
        throw new ApiError(400, "You are not authorized to access all incidents!")
    };

    const {
        status,
        priority,
        category,
        createdBy,
        assignedTo,
        assignedDept,
        // createdFrom,
        // createdTo,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (createdBy) query.createdBy = createdBy;
    if (assignedDept) query.assignedDept = assignedDept;
    if (assignedTo) query.assignedTo = assignedTo;

    //date range filtering
    // if(createdFrom || createdTo){
    //     query.createdAt = {};
    //     if(createdFrom) query.createdAt.$gte = new Date(createdFrom);
    //     if(createdTo) query.createdAt.$lte = new Date(createdTo);
    // };

    const incidents = await Incident.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("createdBy","name email")
        .populate("assignedTo","name email");

    const total = await Incident.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200,
            {
                incidents,
                total,
                currentPage: Number(page),
                totalPages: Math.ceil(total / limit)
            },
            "Filtered incidents fetched successfully")
    );

})

const getMyCreatedIncidents = asyncHandler(async (req, res) => {
    const {
        status,
        priority,
        category,
        assignedTo,
        assignedDept,
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
    } = req.query;

    const query = {};
    query.createdBy = req.user._id;

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedDept) query.assignedDept = assignedDept;
    if (assignedTo) query.assignedTo = assignedTo;

    const myIncidents = await Incident.find(query)
        .sort({ [sortBy]: order === "asc" ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("createdBy","name email")
        .populate("assignedTo","name email");

    const total = await Incident.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                myIncidents,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: Number(page)
            },
            "My created Incidents fetched successfully!"
        )
    )


})

const getIncidentHistory = asyncHandler(async (req, res) => {
    const incidentId = req.params.id;
    if (!incidentId) throw new ApiError(400, "Incident id is required!");

    const isAdminOrTeamlead = ["admin", "team_lead"].includes(req.user.role);
    const isCreatorOrAssignee = req.user._id.toString() === incident.createdBy.toString() || req.user._id.toString() === incident.assignedTo.toString();

    if (!isAdminOrTeamlead && !isCreatorOrAssignee) {
        throw new ApiError(400, "You are not authorized to view the history")
    };

    const incident = await Incident.findById(incidentId);
    if (!incident) throw new ApiError(404, "Incident not found!");

    const incidentHistory = await AuditLog.find({ incidentId })
        .populate("changedBy", "name role")
        .sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, incidentHistory, "incident history fetched successfully!")
    );
})

const getIncidentDetails = asyncHandler(async (req,res) => {
    const incidentId = req.params.id;
    if(!incidentId) throw new ApiError(400,"Incident Id is required!");

    const incident = await Incident.findById(incidentId)
                                .populate("createdBy","name email role")
                                .populate("assignedTo","name email role");
    if(!incident) throw new ApiError(400,"Incident not found!!");

    return res.status(200).json(
        new ApiResponse(200,incident,"incident details fetched successfully!")
    )

})

export { autoClassifyIncident, createIncident, changeAssignDeptManual, updateIncidentStatus, markResolved, closeIncident, reopenIncident, getAllIncidents, getMyCreatedIncidents, getIncidentHistory, getIncidentDetails }
//we have to build this controller also in this for admins to manually change priority, descp, etc in case of if SLA recalculation needed.

// 1️⃣ Do we need an “Update Incident” controller?

// ➡️ Not mandatory right now.

// You already have all lifecycle actions:

// create

// assign manually

// mark in-progress

// mark resolved

// close

// reopen

// That covers 95% of incident operations in a real ITSM flow.

// ✅ Update controller is optional and is mostly used by admins** to:**

// change priority manually (if SLA recalculation needed)

// reassign incident (assignedTo)

// fix description/category if wrong

// So you can safely skip it for now and revisit it when you build the admin panel / dashboard later.