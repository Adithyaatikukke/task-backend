const express = require("express");

const {
    getDashboardStats,
} = require("../controllers/dashboard");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getDashboardStats);

module.exports = router;