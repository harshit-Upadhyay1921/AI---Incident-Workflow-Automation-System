import { AuditLog } from "../models/auditLog.models.js";

/**
 * Records an audit log entry for any incident action
 * @param {Object} params
 * @param {String} params.incidentId - The ID of the affected incident
 * @param {String} params.action - Action performed ("created", "updated", "status_change", "escalated", "resolved")
 * @param {String} params.changedBy - User ID who performed the action
 * @param {Object} [params.before={}] - Snapshot before the change
 * @param {Object} [params.after={}] - Snapshot after the change
 */

// This above block of text you’re seeing is called a JSDoc comment.
// It’s not executable code — it’s just a structured comment used to describe the purpose of a function and its parameters.
// It helps developers (and IDEs like VS Code) understand what the function does, what arguments it expects, and what each one means.
// Each @param describes one parameter (input) that the function accepts.

// Why it’s useful

// ✅ When you hover over recordAuditLog in VS Code, you’ll see all this info pop up as documentation.
// ✅ Helps your teammates quickly understand how to use the function.
// ✅ Improves code readability and maintainability.


export const recordAuditLog = async ({
  incidentId,
  action,
  changedBy,
  before = {},
  after = {},
}) => {
  try {
    await AuditLog.create({
      incidentId,
      action,
      changedBy,
      before,
      after,
    });
  } catch (error) {
    // Do not block main flow if audit fails
    console.error("Audit log recording failed:", error.message);
  }
};
