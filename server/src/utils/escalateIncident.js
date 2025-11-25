import { Incident } from "../models/incident.models.js";
import { getLeastLoadedSupportAgent } from "../services/assignment.services.js";
import { User } from "../models/user.models.js";
import { recordAuditLog } from "./recordAuditLog.js";
import { sendSlackNotification } from "./sendSlackNotification.js"; // temporary placeholder

const escalationFlow = {
    0: "support",
    1: "senior_support",
    2: "team_lead",
    3: "admin"
}

export const escalateIncident = async (incident) => {
    try {
        if (incident.escalationLevel >= 3) return;

        const nextLevel = incident.escalationLevel + 1;
        const nextRole = escalationFlow[nextLevel];

        // const nextAssignee = await User.findOne({
        //     role: nextRole,
        //     department: incident.assignedDept
        // });
        const nextAssignee = await getLeastLoadedSupportAgent(nextRole, incident.assignedDept);

        const before = incident.toObject();

        incident.escalationLevel = nextLevel;
        incident.assignedTo = nextAssignee ? nextAssignee._id : null;

        const SLA_RULES = {
            critical: { slaHours: 1, escalationHours: 0.5 },
            high: { slaHours: 4, escalationHours: 1 },
            medium: { slaHours: 12, escalationHours: 3 },
            low: { slaHours: 24, escalationHours: 6 },
        };

        const { escalationHours } = SLA_RULES[incident.priority || "low"];
        const nextEscalation = new Date(Date.now() + escalationHours * 60 * 60 * 1000);

        incident.nextEscalationAt = nextEscalation;

        await incident.save();

        await recordAuditLog({
            incidentId: incident._id,
            action: "escalated",
            changedBy: "system",
            before,
            after: incident
        });

        // Notification 
       
        await sendSlackNotification(
            `🚨 Escalation Alert: Incident ${incident._id}, Assigned to ${incident.assignedTo} of Assigned Department ${incident.assignedDept} has been escalated to ${nextRole}.`
        );

    } catch (error) {
        console.error("Escalation failed:", error.message);
    }
}