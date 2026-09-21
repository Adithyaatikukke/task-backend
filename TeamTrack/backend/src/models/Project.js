const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Project name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        status: {
            type: String,
            enum: ["Active", "On Hold", "Completed"],
            default: "Active",
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "A project must have a manager"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);