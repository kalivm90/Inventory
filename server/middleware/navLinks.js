const Category = require("../models/category");
const Subcategory = require("../models/subcategory");

const asyncHandler = require("express-async-handler");

const PopulateNavLinks = asyncHandler(async (req, res, next) => {
    try {
        const categories = await Category.find({}, "name").exec();
        res.locals.locals_categories = categories;
    } catch(err) {
        res.locals.locals_categories = []
    }   

    next();
})

module.exports = PopulateNavLinks;