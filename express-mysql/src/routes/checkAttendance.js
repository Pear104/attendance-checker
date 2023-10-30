const express = require("express");
const checkController = require("../controllers/checkAttendance.js");

const router = express.Router();

router.post("/check", checkController.postAttendance);

module.exports = router;
