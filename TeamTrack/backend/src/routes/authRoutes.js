const express = require("express");
const { registerUser, loginUser, getMe, getUsers ,createUser, updateUser, deleteTask} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/users", protect, getUsers);
router.post("/add", protect, createUser);
router.put("/updateUser/:id", protect, updateUser);
router.post("/add", protect, createUser);
router.delete("/deleteUser/:id", protect, deleteTask);

module.exports = router;