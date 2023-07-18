const asyncHandler = require("express-async-handler");
const image = require("../api/google_images")

const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Item = require("../models/item"); 

// index route
exports.index = asyncHandler(async (req, res, next) => {
    const [categories, subcategories, items] = await Promise.all([
        Category.find().exec(),
        Subcategory.find().exec(),
        Item.find().exec()
    ]) 

    res.render("index", {
        title: "Welcome to Kali's Grocery",
        categories: categories,
        subcategories: subcategories,
        items: items
    })
})
// category list
exports.category_list = asyncHandler(async (req, res, next) => {
    const categories = await Category.find().exec();

    res.render("category/category_list", {
        title: "Categories List",
        categories: categories,
    })
})
// category detail
exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, subcategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Subcategory.find({parent_category: req.params.id}).exec(),
    ])

    const itemCount = await Item.find({parent_subcategory: {$in: subcategory.map(sub => sub.id)}}).exec()
    
    if (category === null) {
        res.redirect("/catalog/categories");
    }

    res.render("category/category_detail", {
        title: "Category Details",
        category: category,
        subcategory: subcategory,
        itemCount: itemCount
    })
})

// category create
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send("TODO category create get");
})
exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send("TODO category create post");
})

// category update
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send("TODO category update get");
})
exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send("TODO category update post");
})

// category delete
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send("TODO category delete get");
})
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send("TODO category delete post");
})