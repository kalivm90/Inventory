const asyncHandler = require("express-async-handler");
const image = require("../api/google_images")

const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Item = require("../models/item");

// subcategory list
exports.subcategory_list = asyncHandler(async (req, res, next) => {
    const subcategories = await Subcategory.find()
        .populate("parent_category", "name")
        .exec();
      
    // groups subcategories by thier parent category
    const groupedSubcategories = subcategories.reduce((groups, subcategory) => {
        const parentCategoryName = subcategory.parent_category.name;
        if (!groups[parentCategoryName]) {
            groups[parentCategoryName] = [];
        }

        groups[parentCategoryName].push(subcategory);

        return groups;
    }, {});
    
    // sorts groupedSubcategories so "Other" field appears last
    for (const subcategories of Object.values(groupedSubcategories)) {
        subcategories.sort((a, b) => {
          if (a.name === "Other") {
            return 1;
          }
          if (b.name === "Other") {
            return -1;
          }
          return a.name.localeCompare(b.name);
        });
      }
      

    res.render("subcategory/subcategory_list", {
        title: "Subcategories List", 
        subcategories: groupedSubcategories
    })
})
// subcategory detail
exports.subcategory_detail = asyncHandler(async (req, res, next) => {
    const [subcategory, itemCount] = await Promise.all([
      Subcategory.findById(req.params.id).populate("parent_category", "name").exec(),
      Item.find({parent_subcategory: req.params.id}),
    ])

    if (subcategory === null) {
      res.redirect("/subcategories")
    }

    res.render("subcategory/subcategory_detail", {
      title: "Subcategory Details", 
      subcategory: subcategory,
      itemCount: itemCount,
    })

})

// subcategory create get
exports.subcategory_create_get = asyncHandler(async (req, res, next) => {
  res.send("TODO subcategory create get");
})
// subcategory create post
exports.subcategory_create_post = asyncHandler(async (req, res, next) => {
  res.send("TODO subcategory create post");
})


// subcategory update get
exports.subcategory_update_get = asyncHandler(async (req, res, next) => {
  res.send("TODO subcategory update get");
})
// subcategory update post
exports.subcategory_update_post = asyncHandler(async (req, res, next) => {
  res.send("TODO subcategory update post");
})


// subcategory delete get
exports.subcategory_delete_get = asyncHandler(async (req, res, next) => {
  res.send("TODO subcategory delete get");
})
// subcategory delete post
exports.subcategory_delete_post = asyncHandler(async (req, res, next) => {
  res.send("TODO subcategory delete post");
})