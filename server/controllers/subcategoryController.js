const asyncHandler = require("express-async-handler");

const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const {toTitleCase, removeFilePathOnUpdateDelete} = require("../util/util");

// subcategory list
exports.subcategory_list = asyncHandler(async (req, res, next) => {
    const subcategories = await Subcategory.find()
        .populate("parent_category", "name")
        .exec();
    
    // // groups subcategories by thier parent category
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
  const category = await Category.find().exec(); 

  res.render("subcategory/subcategory_form", {
    title: "Subcategory Create",
    category: category,
  })
})

// subcategory create post
exports.subcategory_create_post = [
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
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const [categories, parent_category] = await Promise.all([
      Category.find().exec(),
      Category.findById(req.body.parentCategory).exec(),
    ])

    const newcategory = new Subcategory({
      name: req.body.name, 
      description: req.body.description, 
      parent_category: parent_category,
    })

    if (!errors.isEmpty()) {
      res.render("subcategories/subcategories_form", {
        title: "Create Subcategory",
        categories: categories,
        errors: errors.array(),
      })
      return;
    } else {

      await newcategory.save()
      res.redirect(newcategory.url)
    }
  })
]


// subcategory delete get
exports.subcategory_delete_get = asyncHandler(async (req, res, next) => {
  const [subcategory, items] = await Promise.all([
    Subcategory.findById(req.params.id).populate("parent_category", "name").exec(),
    Item.find({parent_subcategory: req.params.id}).exec(),
  ])

  if (subcategory === null) {
    res.redirect("/catalog/subcategories")
  }

  res.render("subcategory/subcategory_delete", {
    title: "Subcategory Delete", 
    subcategory: subcategory, 
    items: items,
  })
})
// subcategory delete post
exports.subcategory_delete_post = asyncHandler(async (req, res, next) => {
  const [subcategory, items] = await Promise.all([
    Subcategory.findById(req.params.id).populate("parent_category", "name").exec(),
    Item.find({parent_subcategory: req.params.id}).exec(),
  ])

  if (items.length > 0) {
    res.render("subcategory/subcategory_delete", {
      title: "Subcategory Delete", 
      subcategory: subcategory, 
      items: items,
      error: "Cannot delete subcategory if items are still linked."
    })
    return 
  } else {
    removeFilePathOnUpdateDelete("subcategory", subcategory);

    await Subcategory.findByIdAndDelete(req.params.id);
    res.redirect("/catalog/subcategories")
  }

})


// subcategory update get
exports.subcategory_update_get = asyncHandler(async (req, res, next) => {
  const [subcategory, category] = await Promise.all([
    Subcategory.findById(req.params.id).populate("parent_category", "name").exec(),
    Category.find().exec(),
  ])

  if (subcategory === null) {
    res.redirect("/catalog/subcategories");
  }

  res.render("subcategory/subcategory_form", {
    title: "Update Subcategory", 
    subcategory: subcategory, 
    category: category,
  })
  // res.send("TODO subcategory update get");
})
// subcategory update post
exports.subcategory_update_post = [
  body("name", "Name must be specified.")
    .trim()
    .isLength({min: 1})
    .escape()
    .customSanitizer(toTitleCase),
  body("description")
    .trim()
    .isLength({min: 1}).withMessage("Description must be specified.")
    .isLength({max: 200}).withMessage("Description must be below 200 characters."),

  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const [subcategory, parent_category] = await Promise.all([
      Subcategory.findById(req.params.id).populate("parent_category", "name").exec(),
      Subcategory.findById(req.body.parentCategory).exec(),
    ])

    const newsubcategory = new Subcategory({
      title: req.body.name,
      description: req.body.description, 
      parent_category: parent_category.name,
      _id: req.params.id, 
    })

    if (!errors.isEmpty()) {
      res.render("subcategory/subcategory_form", {
        title: "Update Subcategory", 
        subcategory: subcategory, 
      })
      return 
    } else {
      
      if (req.body.file) removeFilePathOnUpdateDelete("subcategory", subcategory);

      const thesubcategory = await Subcategory.findByIdAndUpdate(req.params.id, newsubcategory, {})
      res.redirect(thesubcategory.url);
    }
  })
]
