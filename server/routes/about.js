const express = require("express")
const router = express.Router();
const aboutController = require("../controllers/aboutController")

// about page
router.get("/", aboutController.index)

module.exports = router