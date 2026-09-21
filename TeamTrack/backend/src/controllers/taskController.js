const Task = require("../models/Task");
const User = require("../models/User")

const getTasks = async (req, res) => {
    try {
        const filter = {};

        if (req.query.project) filter.project = req.query.project;
        if (req.query.status) filter.status = req.query.status;

        if (req.user.role === "employee") {
            filter.assignedTo = req.user._id;
        } else if (req.query.assignedTo) {
            filter.assignedTo = req.query.assignedTo;
        }

        const tasks = await Task.find(filter)
            .populate("project", "name status")
            .populate("assignedTo", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: tasks.length, tasks });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("project", "name status")
            .populate("assignedTo", "name email role");

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task", error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, dueDate } = req.body;

        if (!title || !project) {
            return res.status(400).json({ message: "Task title and project are required" });
        }

        if (assignedTo) {
            const assignee = await User.findById(assignedTo);
            if (!assignee || assignee.role !== "employee") {
                return res.status(400).json({ message: "Tasks can only be assigned to employees" });
            }
        }

        const task = await Task.create({ title, description, project, assignedTo, status, dueDate });

        const populated = await task.populate([
            { path: "project", select: "name status" },
            { path: "assignedTo", select: "name email role" },
        ]);

        res.status(201).json({ message: "Task created successfully", task: populated });
    } catch (error) {
        res.status(500).json({ message: "Failed to create task", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, dueDate } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const isElevated = req.user.role === "admin" || req.user.role === "manager";

        if (!isElevated) {
            if (String(task.assignedTo) !== String(req.user._id)) {
                return res.status(403).json({ message: "You can only update your own tasks" });
            }
            if (status !== undefined) {
            if (status === "Approved") {
                return res.status(403).json({ message: "Only a manager or admin can approve a task" });
            }
            task.status = status;
        }
        } else {
            if (assignedTo !== undefined && assignedTo !== "") {
                const assignee = await User.findById(assignedTo);
                if (!assignee || assignee.role !== "employee") {
                    return res.status(400).json({ message: "Tasks can only be assigned to employees" });
                }
            }
            if (title !== undefined) task.title = title;
            if (description !== undefined) task.description = description;
            if (project !== undefined) task.project = project;
            if (assignedTo !== undefined) task.assignedTo = assignedTo;
            if (status !== undefined) task.status = status;
            if (dueDate !== undefined) task.dueDate = dueDate;
        }

        await task.save();
        const populated = await task.populate([
            { path: "project", select: "name status" },
            { path: "assignedTo", select: "name email role" },
        ]);

        res.status(200).json({ message: "Task updated successfully", task: populated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete task", error: error.message });
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };