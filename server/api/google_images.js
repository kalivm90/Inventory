const fetch = require('isomorphic-fetch');
const mongoose = require('mongoose');
require("dotenv").config();
// download 
const fs = require("fs")
const path = require("path")
const axios = require('axios');
const cliProgress = require('cli-progress');

const Category = require("../models/category");
const Subcategory = require("../models/subcategory")
const Item = require("../models/item")

// Google image search API item= true for food item and false for category
const imageAPI = async(search, item=true, attempts=1) => {

    // use enviornment variables
    const key =  process.env.GOOGLEIMAGES_API_KEY
    const cx = process.env.PROGRAMSE_ID;
    const query = encodeURIComponent(search);
    const siteSearch = "www.walmart.com" 
    let URL = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&searchType=image&q=${query}&num=1`

    if (item) {
        URL += `&siteSearch=${siteSearch}`;
    }

    if (attempts >= 2) return null 

    try {
        const response = await fetch(URL);
        const data = await response.json();

        // checks to see if more than 1 result was found
        if (data.items) {
            const images = data.items.map(item => item.link)

            // console.log(images[0], "api/google_images");

            return images[0]
        } else if (decodeURIComponent(query).split(" ").length > 1) {
            // if not split 2 word search into 1 and research
            console.log("re searching")
            return imageAPI(decodeURIComponent(query).split(" ")[0], item, attempts + 1); 
        }  else {
            console.log(`Error: ${data.error.code}, ${data.error.message}`)
            return null 
        } 

    } catch(err) {
        console.log(`Error fetching image:`, err);
        return null 
    }
}

const ImageHelper = async (querys, item = true) => {
    let queryImage

    if (querys.length > 0) {
        queryImage = await Promise.all(
            querys.map(async query => { 
                const imageUrl = await imageAPI(query.name, item);
                return {query, imageUrl}
            })
        )
    } else {
        const query = querys
        const imageUrl = await imageAPI(query.name, item);
        queryImage = {query, imageUrl};
    }

    return queryImage
};



const queryDB = async () => {
    const [subcategory, item] = await Promise.all([
        Subcategory
            .find()
            .populate({path: "parent_category", model: Category, select: "name"})
            .exec(),
        Item
            .find()
            .populate({path: "parent_subcategory", model: Subcategory, select: "name"})
            .exec()
    ])

    // filtered out subcategory drinks since I already had them
    const filteredSubcategory = subcategory.filter(i => i.parent_category.name !== "Drinks") 

    return {subcategory: filteredSubcategory, item: item};
}


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        })

    console.log("Connected to MongoDB database")
    return queryDB();
        
    } catch (err) {
        console.log(`Something went wrong ${err}`);
        return null
    }
}


const downloadImage = async (url, destination) => {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
      });
  
      const totalLength = parseInt(response.headers['content-length'], 10);
      let downloadedLength = 0;
  
      const progressBar = new cliProgress.SingleBar({
        format: 'Progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      });
  
      response.data.on('data', (chunk) => {
        downloadedLength += chunk.length;
        progressBar.update(downloadedLength);
      });
  
      response.data.on('end', () => {
        progressBar.stop();
        console.log('Image downloaded successfully!');
      });
  
      progressBar.start(totalLength, 0);
  
      response.data.pipe(fs.createWriteStream(destination));
    } catch (err) {
      console.log('Error downloading image:', err);
    }
};

// HAVE TO RUN THIS FROM SERVER/ node api/google_images or else env varaibles dont work. Also all paths are starting from server NOT api

const main = async () => {
    const documents = await connectDb();

    const getLinks = async (items, imagePath) => {
        for (const item of items) {
          let destination;
          const link = await imageAPI(item.name, false);
          const parentDocument = item.parent_category?.name || item.parent_subcategory?.name
    
          if (item.name.split(" ").length > 1) {
            destination = `${imagePath}/${item.name.toLowerCase().replace(" ", "_")}_${parentDocument.toLowerCase()}.jpg`;
          } else {
            destination = `${imagePath}/${item.name.toLowerCase()}_${parentDocument.toLowerCase()}.jpg`;
          }
    
          await downloadImage(link, destination);
        }
    };


    if (documents !== null) {
        // subcategory done
        // await getLinks(documents.subcategory, "../public/images/subcategories", documents.subcategory.parent_category);
        await getLinks(documents.item, "../public/images/items", documents.item.parent_subcategory);
      } else {
        console.log("Something went wrong with the query");
      }

    console.log("\nFinished All Downloads")
}



const test = async() => {
    const link = await imageAPI("Sprite", false)
    console.log("Link Recieved")

    const directory = '../public/images/test/';
    const filename = 'sprite.jpg';
    const completePath = path.join(directory, filename);

    console.log("Starting Download...")
    await downloadImage(link, completePath);
}
// test();
// ImageSearch("Meats", false)

// main();

module.exports = ImageHelper;
