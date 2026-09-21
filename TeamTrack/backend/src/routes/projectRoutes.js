const express = require("express");
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", authorize("admin", "manager"), createProject);
router.put("/:id", authorize("admin", "manager"), updateProject);
router.delete("/:id", authorize("admin"), deleteProject);

module.exports = router;