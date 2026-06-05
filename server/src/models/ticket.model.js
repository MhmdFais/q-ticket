const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Comment message is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: [
        "Bug",
        "Feature Request",
        "Technical Issue",
        "Payment Issue",
        "Account Issue",
        "Other",
      ],
      required: [true, "Category is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      required: [true, "Priority is required"],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [commentSchema],
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true },
);

// Auto generate ticket number before saving
ticketSchema.pre("save", async function () {
  if (!this.isNew) return;

  const count = await mongoose.model("Ticket").countDocuments();
  this.ticketNumber = `TKT-${String(count + 1).padStart(4, "0")}`;
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
