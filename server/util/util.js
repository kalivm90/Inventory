const fs = require("fs");
const path = require("path");

const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

// these probably be refractored quite a bit but for the sake of time I am leaving them. may come back to this.


// when create post routes are called this sets the images pathname so they are stored correctly.
exports.setPath = async (destination, req) => {
    let filename;

    switch (destination) {
        case "categories":  
          filename = `${req.body.name.toLowerCase().replace(" ", "_")}.jpg`;
          break;
        case "subcategories": 
            // req.body.parentCategory comes back as an id so I have to query the db 
            const category = await Category.findById(req.body.parentCategory).exec();

            if (req.body.name.split(" ").length > 1) {
                // if it 2 words, just replace spaces with _
                filename = `${req.body.name.toLowerCase().replace(" ", "_")}.jpg`
            } else {
                // if 1 word tag the parent category at the end with _ seperator
                filename = `${req.body.name.toLowerCase() + `_${category.name.toLowerCase()}`}.jpg`
            };    
            console.log(filename);
            break;
        case "items": 
          // req.body.parent_subcategory comes back as an id so I have to query the db
          const parent_subcategory = await Subcategory.findById(req.body.parent_subcategory).exec()
          console.log(parent_subcategory);

          if (req.body.name.split(" ").length > 1) {
            filename = `${req.body.name.toLowerCase().replace(/ /g, '_')}_${parent_subcategory.name.toLowerCase().replace(/ /g, '_')}.jpg`
          } else {
            filename = `${req.body.name.toLowerCase()}_${parent_subcategory.name.toLowerCase().replace(" ", "_")}.jpg`
          }
          break;
        default: 
          console.log("Something went wrong, check path. This error came from util/setFilePath.js")
      }

      return filename 
}

exports.toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

// when update and delete post routes are called, if there are no validation errors this gets called to delete images associated with document
exports.removeFilePathOnUpdateDelete = (name, document) => {
  let oldImagePath;

  switch (name) {
    case "category": 
      oldImagePath = path.join(__dirname, '../../public/images/categories', `${document.name.toLowerCase().replace(' ', '_')}.jpg`);
      break; 
    case "subcategory": 
      if (document.name.split(" ").length > 1) {
        // if 2 word name seperate with "_"
        oldImagePath = path.join(__dirname, `../../public/images/subcategories/${document.name.toLowerCase().replace(" ", "_")}.jpg`);
      } else {
        // if 1 word name append parent category name at the end seperated with "_"
        oldImagePath = path.join(__dirname, `../../public/images/subcategories/${document.name.toLowerCase() + `_${document.parent_category.name.toLowerCase()}`}.jpg`);
      }
      break;
    case "item":
      console.log("ITEM CALLED RFPOUPD")

      if (document.name.split(" ").length > 1) {
        oldImagePath = path.join(__dirname, `../../public/images/items/${document.name.toLowerCase().replace(/ /g, '_')}_${document.parent_subcategory.name.toLowerCase().replace(/ /g, '_')}.jpg`)
      } else {
        oldImagePath = path.join(__dirname, `../../public/images/items/${document.name.toLowerCase()}_${document.parent_subcategory.name.toLowerCase().replace(" ", "_")}.jpg`)
      }
      console.log(oldImagePath);
      break;
    default: 
      console.log("something went wrong in util/removeFilePathOnUpdateDelete")
      break;
  } 

  fs.unlink(oldImagePath, (err) => {
      if (err) console.error("File not removed or not found", err)
      else console.log("Success")
  })
}