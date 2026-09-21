const Project = require("../models/Project");

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("manager", "name email role")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: projects.length, projects });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("manager", "name email role");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch project", error: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, description, status, manager } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const project = await Project.create({
            name,
            description,
            status,
            manager: manager || req.user._id,
        });

        const populated = await project.populate("manager", "name email role");

        res.status(201).json({ message: "Project created successfully", project: populated });
    } catch (error) {
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const { name, description, status, manager } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (status !== undefined) project.status = status;
        if (manager !== undefined) project.manager = manager;

        await project.save();
        const populated = await project.populate("manager", "name email role");

        res.status(200).json({ message: "Project updated successfully", project: populated });
    } catch (error) {
        res.status(500).json({ message: "Failed to update project", error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.deleteOne();

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
};