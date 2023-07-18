var express = require('express');
const asyncHandler = require("express-async-handler");
var router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.redirect("/catalog");
})

module.exports = router;
