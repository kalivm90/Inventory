const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const {toTitleCase, removeFilePathOnUpdateDelete} = require("../util/util")
const fs = require("fs");
const path = require("path");


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
    const category = await Category.find().exec()

    res.render("category/category_form", {
        title: "Create Category",
        category: category,
    })
})
exports.category_create_post = [
    body("name")
        .trim()
        .isLength({min: 1})
        .withMessage("Name must be specified")
        .escape()
        .customSanitizer(toTitleCase),
    body("description")
        .trim()
        .isLength({min: 1})
        .withMessage("Description must be specified")
        .isLength({max: 200})
        .withMessage("Description must be less than 200 characters"),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        const newcategory = new Category({
            name: req.body.name, 
            description: req.body.description 
        })

        if (!errors.isEmpty()) {
            const category = await Category.findById(req.params.id).exec()

            res.render("category/category", {
                title: "Create Category",
                category: category,
                errors: errors.array(),
            })

            return 
        } else {
            await newcategory.save();
            res.redirect(newcategory.url);
        } 

    })
]

// category delete
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const [category, subcategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Subcategory.find({parent_category: req.params.id}),         
    ])

    const itemCount = await Item.find({parent_subcategory: {$in: subcategory.map(sub => sub.id)}}).exec()

    if (category === null) {
        res.redirect("/catalog/categories")
    } 

    res.render("category/category_delete", {
        title: "Delete Category", 
        category: category,
        subcategory: subcategory,
        itemCount: itemCount,
    })


})
exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const [category, subcategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Subcategory.find({parent_category: req.params.id}), 
    ])

    const itemCount = await Item.find({parent_subcategory: {$in: subcategory.map(sub => sub.id)}}).exec()


    if (subcategory.length > 0 || itemCount.length > 0) {
        res.render("category/category_delete", {
            title: "Delete Category", 
            category: category,
            subcategory: subcategory,
            itemCount: itemCount,
        })
        return 
    } else {
        removeFilePathOnUpdateDelete("category", category);
        
        await Category.findByIdAndDelete(req.body.categoryid);
        res.redirect("/catalog/categories")
    }
})

// category update
exports.category_update_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec()

    if (category === null) {
        res.redirect("/catalog/categories")
    }

    res.render("category/category_form", {
        title: "Update Category", 
        category: category,
    })
})

exports.category_update_post = [
    body("name")
        .trim()
        .isLength({min: 1})
        .withMessage("Name must be included")
        .escape(),
    body("description")
        .trim()
        .isLength({min: 1})
        .withMessage("Description must be specified")
        .isLength({max: 100})
        .withMessage("You have exceeded 100 characters"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const category = await Category.findById(req.params.id).exec();

        const newCategory = new Category ({
            name: req.body.name, 
            description: req.body.description,
            _id: req.params.id,
        })

        if (!errors.isEmpty()) {
            res.render("category/category_form", {
                title: "Update Category",
                category: category, 
                errors: errors.array(),
            })
            return 
        } else {

            if (req.body.file) removeFilePathOnUpdateDelete("category", category); 

            const thecategory = await Category.findByIdAndUpdate(req.params.id, newCategory, {});
            res.redirect(thecategory.url);
        }
    })
]
