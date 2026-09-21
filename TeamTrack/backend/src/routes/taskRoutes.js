const express = require("express");
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", authorize("admin", "manager"), createTask);
router.put("/:id", updateTask);
router.delete("/:id", authorize("admin", "manager"), deleteTask);

module.exports = router;