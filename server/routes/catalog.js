const express = require("express")
const router = express.Router();
const asyncHandler = require("express-async-handler");
// controllers 
const categoryController = require("../controllers/categoryController");
const subcategoryController = require("../controllers/subcategoryController");
const itemController = require("../controllers/itemController")

// create, update, delete pages for category, item, subcategory 


// index
router.get("/", categoryController.index)

// CATEGORY
    // category-create
router.get("/category/create", categoryController.category_create_get)
router.post("/category/create", categoryController.category_create_post)
    // category-list/detail
router.get("/categories", categoryController.category_list)
router.get("/category/:id", categoryController.category_detail);
    // category-update
router.get("/category/:id/update", categoryController.category_update_get)
router.post("/catagory/:id/update", categoryController.category_update_post)
    // category-delete
router.get("/category/:id/delete", categoryController.category_delete_get)
router.post("/category/:id/delete", categoryController.category_delete_post)


// SUBCATEGORY
    // subcategory-create
router.get("/subcategory/create", subcategoryController.subcategory_create_get)
router.post("/subcategory/create", subcategoryController.subcategory_create_post)
    // subcategory-list/detail
router.get("/subcategories", subcategoryController.subcategory_list)
router.get("/subcategory/:id", subcategoryController.subcategory_detail)
    // subcategory-update
router.get("/subcategory/:id/update", subcategoryController.subcategory_update_get)
router.post("/subcatagory/:id/update", subcategoryController.subcategory_update_post)
    // subcategory-delete
router.get("/subcategory/:id/delete", subcategoryController.subcategory_delete_get)
router.post("/subcategory/:id/delete", subcategoryController.subcategory_delete_post)


// ITEM 
    // item-create
router.get("/item/create", itemController.item_create_get)
router.post("/item/create", itemController.item_create_post)
    // item-list/detail
router.get("/items", itemController.item_list);
router.get("/item/:id", itemController.item_detail);
    // item-update
router.get("/item/:id/update", itemController.item_update_get)
router.post("/item/:id/update", itemController.item_update_post)
    // item-delete
router.get("/item/:id/delete", itemController.item_delete_get)
router.post("/item/:id/delete", itemController.item_delete_post)



module.exports = router;