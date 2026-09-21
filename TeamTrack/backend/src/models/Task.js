const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "A task must belong to a project"],
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Approved","Reopened"],
            default: "Pending",
        },
        dueDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);