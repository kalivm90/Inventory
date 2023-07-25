const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const {toTitleCase, removeFilePathOnUpdateDelete} = require("../util/util");

const Item = require("../models/item"); 
const Subcategory = require("../models/subcategory");


const ITEMS_PER_PAGE = 12;

// item list
exports.item_list = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const skipItems = (page - 1) * ITEMS_PER_PAGE;

    const itemCount = await Item.countDocuments();
    const totalPages = Math.ceil(itemCount / ITEMS_PER_PAGE);

    const items = await Item.find()
        .populate({
            path: "parent_subcategory",
            select: "name",
            populate: {
                path: "parent_category",
                select: "name",
            }
        })
        .skip(skipItems)
        .limit(ITEMS_PER_PAGE)
        .exec();

    res.render("item/item_list", {
        title: "Item List",
        items: items,
        currentPage: page,
        totalPages: totalPages
    });
});

// item detail
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("parent_subcategory", "name").exec();
    
    if (item === null) {
        res.redirect("/items")
    }
    res.render("item/item_detail", {
        title: "Item Details",
        item: item,
    })
})


// item create get
exports.item_create_get = asyncHandler(async (req, res, next) => {
    const subcategory = await Subcategory.find().exec()

    res.render("item/item_form", {
        title: "Item Create",
        subcategory: subcategory,
    })
})
// item create post
exports.item_create_post = [
    body("name", "Name must be specified.")
        .trim()
        .isLength({min: 1})
        .escape()
        .customSanitizer(toTitleCase),
    body("description")
        .trim()
        .isLength({min: 1}).withMessage("Description must be specified.")
        .isLength({max: 200}).withMessage("Description must be below 200 characters.")
        .escape(),
    body("price", "Price must be specified.")
        .trim()
        .notEmpty().withMessage('Price must be specified.')
        .isFloat().withMessage('Price must be a valid number.'),
    body("number_in_stock")
        .trim()
        .notEmpty().withMessage('Number in stock must be specified.')
        .isInt({ min: 0 }).withMessage('Number in stock must be a non-negative integer.'),
    body("skew")
        .trim()
        .notEmpty().withMessage("Skew must be specified.")
        .isLength({min: 11, max: 11}).withMessage("Skew has to be exactly 11 characters"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        console.log(req.body);

        if (!errors.isEmpty()) {
            const subcatagory = await Subcategory.find().exec();

            res.render("item/item_form", {
                title: "Create Item", 
                subcatagory: subcatagory,
            })

            return;
        } else {
            
            const parent_subcategory = await Subcategory.findById(req.body.parent_subcategory).exec();
            
            const newitem = new Item({
                name: req.body.name, 
                description: req.body.description,
                parent_subcategory: parent_subcategory,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                skew: req.body.skew, 
            })

            await newitem.save();
            res.redirect(newitem.url);
        }
    })
]


// item delete get 
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("parent_subcategory", "name").exec();

    if (item === null) {
        res.redirect("/catalog/items");
    } else {
        res.render("item/item_delete", {
            title: "Item Delete",
            item: item, 
        })
    }
})
// item delete post 
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate("parent_subcategory", "name").exec()

    if (item === null) {
        res.redirect("/catalog/items")
    } else {
        removeFilePathOnUpdateDelete("item", item);

        await Item.findByIdAndDelete(req.params.id).exec()
        res.redirect("/catalog/items");
    }
})


// item update get 
exports.item_update_get = asyncHandler(async (req, res, next) => {
    const [item, subcategory] = await Promise.all([
        Item.findById(req.params.id).populate("parent_subcategory", "name").exec(),
        Subcategory.find().select("name _id").exec(),
    ])

    if (item === null) {
        res.redirect("/catalog/items")
    } 

    res.render("item/item_form", {
        title: "Item Update",
        item: item,
        subcategory: subcategory,
    })
})
// item update post 
exports.item_update_post = [
    body("name", "Name must be specified.")
        .trim()
        .isLength({min: 1})
        .escape()
        .customSanitizer(toTitleCase),
    body("description")
        .trim()
        .isLength({min: 1}).withMessage("Description must be specified.")
        .isLength({max: 200}).withMessage("Description must be below 200 characters.")
        .escape(),
    body("price", "Price must be specified.")
        .trim()
        .notEmpty().withMessage('Price must be specified.')
        .isFloat().withMessage('Price must be a valid number.'),
    body("number_in_stock")
        .trim()
        .notEmpty().withMessage('Number in stock must be specified.')
        .isInt({ min: 0 }).withMessage('Number in stock must be a non-negative integer.'),
    body("skew")
        .trim()
        .notEmpty().withMessage("Skew must be specified.")
        .isLength({min: 11, max: 11}).withMessage("Skew has to be exactly 11 characters"),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const [item, subcategory] = await Promise.all([
            Item.findById(req.params.id).populate("parent_subcategory", "name").exec(),
            // used to populate combobox
            Subcategory.find().select("name _id").exec(),
        ])

        if (!errors.isEmpty()) {
            res.render("item/item_form", {
                title: "Item Update", 
                item: item,
                subcategory: subcategory,
                errors: errors.array(),
            }) 
            return;
        } else {
            // searching name from id value returned by combobox
            const parent_subcategory = await Subcategory.findById(req.body.parent_subcategory).exec();

            const newitem = new Item({
                name: req.body.name, 
                description: req.body.description,
                parent_subcategory: parent_subcategory,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                skew: req.body.skew, 
                _id: req.params.id,
            })

            if (req.body.file) removeFilePathOnUpdateDelete("item", item); 

            const theitem = await Item.findByIdAndUpdate(req.params.id, newitem, {})
            res.redirect(theitem.url);
        }
    })
]
