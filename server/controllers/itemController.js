const asyncHandler = require("express-async-handler");

const Item = require("../models/item"); 


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
    res.send("TODO item create get")
})
// item create post
exports.item_create_post = asyncHandler(async (req, res, next) => {
    res.send("TODO item create post")
})


// item update get 
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.send("TODO item update get")
})
// item update post 
exports.item_update_post = asyncHandler(async (req, res, next) => {
    res.send("TODO item update post")
})

// item delete get 
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    res.send("TODO item delete get")
})
// item delete post 
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    res.send("TODO item delete post")
})