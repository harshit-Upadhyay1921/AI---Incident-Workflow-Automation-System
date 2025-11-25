import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "status_change", "escalated", "resolved"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    before: {
      type: Object, // Full snapshot before change
      default: {},
    },
    after: {
      type: Object, // Full snapshot after change
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Index for faster queries per incident
auditLogSchema.index({ incidentId: 1, timestamp: -1 });   
// MongoDB first filters by incidentId → then within those results it sorts by latest timestamp.
// So you instantly get:
// “all changes for this incident, newest first” without an additional sort.

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);

// why this object is representing incident only not user ??

// type: Object does not automatically know it’s an Incident.
// The reason this object represents the Incident and not the User is because we decide what we store in it.

// Why it represents Incident specifically
// When we create the audit log, we will manually do something like:

// AuditLog.create({
//   incidentId: incident._id,
//   changedBy: user._id,
//   before: { status: oldStatus, priority: oldPriority, ... },
//   after: { status: newStatus, priority: newPriority, ... }
// })

// You see — we are inserting the incident fields into before/after.
// Not user fields.
// Because at runtime, we put incident snapshots, those objects represent incident, not user.
// If tomorrow you wanted to audit Users, could you?
// ✅ Yes
// You’d log user data instead of incident data → same schema still works.
// This is why:
// type: Object is generic
// but what we store inside is incident-specific
