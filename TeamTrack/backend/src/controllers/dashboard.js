const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async(req,res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        let projectFilter = {};
        let taskFilter = {};
        if(role==="admin"){
            projectFilter={}
            taskFilter={}
        }else if(role==="manager"){
            projectFilter = {
                manager:userId
            }
            const managerProjects  = await Project.find({
                manager:userId,
            }).select("_id");
            const projectsId = managerProjects.find((project)=>project._id);
            taskFilter = {
                project:{$in:projectsId},
            }
        }else if(role==="employee"){
            taskFilter= {
                assignedTo: userId,
            }
            const employeeTasks = await Task.find({
                assignedTo: userId,
        }).select("project");
        const projectIds = employeeTasks.find((task)=>task.project);
        projectFilter = {
            _id: { $in: projectIds },
        };
        }
        else {
            return res.status(403).json({
                message: "Invalid user role",
            });
        }
        const activeProjects = await Project.countDocuments({
            ...projectFilter,
            status: "Active",
        });
        const pendingTasks = await Task.countDocuments({
            ...taskFilter,
            status: { $ne: "Completed" },
        });

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const completedThisWeek = await Task.countDocuments({
            ...taskFilter,
            status: "Completed",
            updatedAt: {
                $gte: startOfWeek,
                $lte: now,
            },
        });
        res.status(200).json({
            activeProjects,
            pendingTasks,
            completedThisWeek,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard statistics",
            error: error.message,
        });
    }
}



module.exports = {
    getDashboardStats,
};