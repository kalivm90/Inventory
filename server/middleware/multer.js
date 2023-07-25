// setMulter.js
const multer = require("multer");
const {setPath} = require("../util/util");
const path = require("path");
const fs = require("fs");

const setMulter = (destination) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const imagesPath = path.join(__dirname, `../../public/images/${destination}`)
      cb(null, imagesPath);
    },
    filename: async (req, file, cb) => {
      const filename = await setPath(destination, req);
      cb(null, filename);
    },
  });

  return multer({ storage: storage }).single("image");
};

module.exports = setMulter;
