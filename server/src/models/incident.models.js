// import mongoose from "mongoose";

// const incidentSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     category: {
//       type: String,
//       enum: ["software", "hardware", "network", "other"],
//       default: "other",
//     },
//     priority: {
//       type: String,
//       enum: ["low", "medium", "high", "critical"],
//       default: "low",
//     },
//     status: {
//       type: String,
//       enum: ["open", "in-progress", "resolved", "closed"],
//       default: "open",
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },
//     escalationLevel: {
//       type: Number,
//       default: 0,
//     },
//     nextEscalationAt: {
//       type: Date,
//       default: null,
//     },
//     dueAt: {
//       type: Date,
//       default: null,
//     },
//     resolvedAt: {
//       type: Date,
//       default: null,
//     },
//     attachments: [
//       {
//         type: String, // URLs of uploaded files
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // index for faster dashboard queries
// incidentSchema.index({ status: 1, priority: 1 });   //this is a compound indexing.As most of the dashboard/admin queries include both example- 
// // Incident.find({ status: "open", priority: "high" }). but what if somebody made query by status only then in that also it will work fine because
// // A compound index on { status: 1, priority: 1 } CAN still be used even if your query filters only by status, because status is the first field in the compound index. 
// // So this query will use the index:
// // Incident.find({ status: "open" })
// // But this query will NOT (because priority is not first):
// // Incident.find({ priority: "high" })

// // That’s okay, because 99% of dashboards filter by status first, then priority.
// // ✅ So your compound index is still the optimal choice.

// export const Incident = mongoose.model("Incident", incidentSchema);

import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["software", "hardware", "network", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    assignedDept: {
      type: String,
      enum: ["IT", "HR"],
      // required: true, // will be auto-set = user's department
      index: true,
    },
    escalationLevel: {
      type: Number,
      default: 0,
    },
    nextEscalationAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    dueAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queue lookups
incidentSchema.index(
  { assignedDept: 1, priority: -1, status: 1 },
  { name: "dept_priority_status_index" }
);

export const Incident = mongoose.model("Incident", incidentSchema);
