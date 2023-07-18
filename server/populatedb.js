#! /usr/bin/env node 


console.log(
    "This script populates categories and items into the database, Specified database as argument - e.g.: node populatedb 'mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority'"
)
require("dotenv").config();

const Category = require("./models/category");
const Subcategory = require("./models/subcategory");
const Item = require("./models/item");

const categories = []
const subcategories = []
const items = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false) // prepare for mongoose 7 

// using env var
const mongoDB = process.env.MONGODB_URI

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createSubcategories();
    await createItems();
    console.log("Closing mongoose")
    mongoose.connection.close();

    // console.log(subcategories);
}

const createCategories = async() => {
    console.log("Adding Category");
    await Promise.all([
        categoryCreate(
            "Drinks",
            "Beverages that are commonly consumed, such as water, juices, soft drinks, sports drinks, tea, coffee, energy drinks, and alcoholic beverages. This category offers a wide range of options to quench thirst and suit different preferences and dietary needs.",
        ),
        categoryCreate(
            "Meat",
            "Various animal-based proteins, including beef, poultry (such as chicken and turkey), pork, lamb, and fish. It may also include processed meats like sausages, bacon, and deli meats. This category provides options for those who include meat in their diet, offering different cuts, varieties, and preparation options."
        ),
        categoryCreate(
            "Dairy",
            "Products derived from animal milk, such as milk itself, cheese, yogurt, butter, and cream. It may also include plant-based alternatives like soy milk, almond milk, and coconut milk. This category provides a range of dairy and non-dairy options for those seeking calcium-rich products or alternatives to traditional dairy."
        ),
        categoryCreate(
            "Produce",
            "Fruits and vegetables. It includes a wide variety of seasonal and year-round options, ranging from leafy greens, colorful fruits, root vegetables, herbs, and more. This category emphasizes fresh, nutritious, and vibrant ingredients that are essential for a balanced diet."
        ),
        categoryCreate(
            "Snacks",
            "Diverse assortment of ready-to-eat foods that are typically consumed between meals. This category offers a variety of options for satisfying cravings or providing quick energy boosts."
        ),
        categoryCreate(
            "Candy",
            "Sweet treats that are often enjoyed as indulgences or for special occasions. It includes chocolates, gummies, hard candies, caramels, lollipops, and other confectionery items. This category provides a range of choices for those with a sweet tooth or looking for delightful gifts."
        ),
    ])
}

const createSubcategories = async () => {
    console.log("Adding Sub Category")
    await Promise.all([
        // DRINKS 
        subcategoryCreate(
            "Soda",
            "Soda, also known as carbonated soft drinks or fizzy drinks, refers to a range of beverages that are typically carbonated and flavored.",
            categories[0],
        ),
        subcategoryCreate(
            "Sports Drinks",
            "Beverages designed to help replenish fluids, electrolytes, and energy during or after physical activity. They are commonly consumed by athletes and individuals engaging in intense exercise or sports.",
            categories[0],
        ),
        subcategoryCreate(
            "Energy Drinks",
            "Beverages that contain stimulant substances, primarily caffeine, along with other ingredients like sugars, amino acids, vitamins, and herbal extracts.",
            categories[0],
        ),
        subcategoryCreate(
            "Other",
            "These beverages dont exactly fit into the other subcategories and may also link to other general categories.",
            categories[0],
        ),
        // MEAT 
        subcategoryCreate(
            "Pork",
            "Pork refers to meat that comes from pigs. It is a widely consumed meat worldwide and is known for its tender texture and rich flavor.",
            categories[1],
        ),
        subcategoryCreate(
            "Beef", 
            "Beef is a popular type of meat that comes from cattle, particularly cows. It is widely consumed around the world and offers a variety of cuts and preparations.",
            categories[1],
        ),
        subcategoryCreate(
            "Chicken", 
            "Chicken is one of the most commonly consumed types of poultry meat. It is known for its mild flavor and relatively lean meat.",
            categories[1]
        ),
        subcategoryCreate(
            "Other", 
            "This category is designed to accommodate a wide array of options that include other animal products and alternate meat.",
            categories[1]
        ),
        // DAIRY 
        subcategoryCreate(
            "Cheese", 
            "Cheese is a dairy product made by coagulating milk and separating the curds from the whey. It comes in a wide range of flavors, textures, and varieties.",
            categories[2],
        ), 
        subcategoryCreate(
            "Butter", 
            "Butter is a dairy product that is made by churning cream or fermented milk. It has a solid or semi-solid consistency and a rich, creamy flavor.", 
            categories[2],
        ),
        subcategoryCreate(
            "Milk",
            "Milk is a nutritious liquid produced by mammals, primarily from cows. Milk is rich in essential nutrients such as calcium, protein, vitamins, and minerals.",
            categories[2],
        ),
        subcategoryCreate(
            "Other",
            "This category offers diverse dairy options beyond the traditional staples, providing a platform for exploring unique textures, flavors, and culinary experiences.",
            categories[2],
        ),
        // PRODUCE
        subcategoryCreate(
            "Fruits",
            "Fruits are typically sweet or sometimes tangy, and they are enjoyed for their natural sweetness and juiciness. They are rich in essential vitamins, minerals, fiber, and antioxidants.",
            categories[3],
        ),
        subcategoryCreate(
            "Vegetables",
            "Vegetables are edible plants that are typically consumed in savory dishes. They are known for their various textures, flavors, and nutritional benefits.",
            categories[3],
        ),
        subcategoryCreate(
            "Other",
            "This category includes items such as herbs, mushrooms, sprouts, nuts, seeds, edible flowers, and specialty produce.",
            categories[3],
        ),
        // SNACKS
        subcategoryCreate(
            "Chips",
            "Chips are thin slices of potatoes or other vegetables that are deep-fried or baked until crispy. They come in a wide range of flavors, textures, and shapes.",
            categories[4],
        ),
        subcategoryCreate(
            "Crackers",
            "Crackers are thin, crisp biscuits often made from flour. They can be enjoyed plain or enhanced with seasonings like salt, cheese, herbs, or spices.",
            categories[4],
        ),
        subcategoryCreate(
            "Popcorn", 
            "Popcorn is a light and fluffy snack made from heated corn kernels. It is a versatile treat that can be enjoyed in various forms.",
            categories[4],
        ),
        subcategoryCreate(
            "Other",
            "Encompasses a variety of unique and alternative snack options and also healthy alternatives.",
            categories[4],
        ),
        // CANDY
        subcategoryCreate(
            "Chocolate",
            "Chocolates are delectable treats made from cocoa beans that have been roasted and processed into a smooth, creamy, and sweet confection.",
            categories[5],
        ),
        subcategoryCreate(
            "Gummies",
            "Gummies are soft, chewy candies that are enjoyed by both children and adults. They are made using gelatin or vegetarian alternatives.",
            categories[5],
        ),
        subcategoryCreate(
            "Hard Candy",
            "These candies are known for their solid, crystalized form, vibrant colors, and long lasting glass like form.",
            categories[5],
        ),
        subcategoryCreate(
            "Other",
            "Candy that often includes novelty items, regional specialties, or creative combinations of flavors and textures.",
            categories[5],
        ),
    ])
}

const createItems = async () => {
    console.log("Adding Item");
    await Promise.all([
// Drinks
        // Drink - Soda
        itemCreate("Coke", "Classic cola soda", subcategories[0], 1.99, 56, "x3Fb5E2p9A1"),
        itemCreate("Pepsi", "Refreshing cola soda", subcategories[0], 1.79, 84, "P7X6bN8z1Y"),
        itemCreate("Sprite", "Crisp lemon-lime soda", subcategories[0], 1.49, 23, "K4vW7s1L8T"),

        // Drink - Sports Drinks
        itemCreate("Gatorade", "Hydrating sports drink", subcategories[1], 2.49, 72, "R5T2vW9k0D1"),
        itemCreate("Powerade", "Electrolyte sports drink", subcategories[1], 2.19, 39, "M3X6dL8p7C2"),
        itemCreate("BodyArmor", "Performance sports drink", subcategories[1], 2.99, 0, "Z1V5rG9q4K3"),

        // Drink - Energy Drinks
        itemCreate("Red Bull", "Energy drink with caffeine", subcategories[2], 2.29, 58, "S5F1cN7g2T3"),
        itemCreate("Monster", "High-energy drink", subcategories[2], 2.49, 76, "B3H9pR5j2W1"),
        itemCreate("Rockstar", "Powerful energy drink", subcategories[2], 2.39, 41, "D1Z8kL7m4Q6"),
 
        // Drink - Other 
        itemCreate("Iced Tea", "Refreshing tea beverage", subcategories[3], 1.99, 37, "T9G3bM6r2L1"),
        itemCreate("Lemonade", "Tangy and sweet drink", subcategories[3], 1.79, 49, "C2K7vF5q3R1"),
        itemCreate("Fruit Punch", "Fruity and refreshing punch", subcategories[3], 2.29, 28, "P4X6wS9t2V3"),
// Meats
        // Meat - Pork
        itemCreate("Pork Chop", "Tender and flavorful pork chop", subcategories[4], 5.99, 20, "P2H5fC7q1R3"),
        itemCreate("Pork Belly", "Rich and fatty pork belly", subcategories[4], 6.99, 15, "B3J9pL5m2Q4"),
        itemCreate("Pork Sausage", "Savory pork sausage", subcategories[4], 4.99, 30, "S6T4vR9k1D2"),

        // Meat - Chicken
        itemCreate("Chicken Breast", "Lean and versatile chicken breast", subcategories[5], 4.49, 25, "B5H2pM9r7Q1"),
        itemCreate("Chicken Thigh", "Juicy and flavorful chicken thigh", subcategories[5], 3.99, 35, "T3C7fH2m9R5"),
        itemCreate("Whole Chicken", "Whole chicken for roasting", subcategories[5], 6.99, 18, "W1C6hR9k2N4"),

        // Meat - Beef
        itemCreate("Beef Steak", "Tender and juicy beef steak", subcategories[6], 9.99, 12, "S4F6cJ9g3T1"),
        itemCreate("Ground Beef", "Versatile ground beef", subcategories[6], 5.49, 28, "G5B2fH7p4M3"),
        itemCreate("Beef Roast", "Flavorful beef roast for slow cooking", subcategories[6], 8.99, 15, "R8F3cM4j7S1"),

        // Meat - Other
        itemCreate("Lamb Chops", "Delicious and tender lamb chops", subcategories[7], 12.99, 10, "L2C5hR7k9P3"),
        itemCreate("Turkey Breast", "Lean and healthy turkey breast", subcategories[7], 7.99, 15, "T9B2fH4m6R8"),
        itemCreate("Veal Cutlet", "Tender and delicate veal cutlet", subcategories[7], 11.99, 0, "V4C8hR3k6L9"),
        itemCreate("Vegan Burger", "Plant-based burger patty", subcategories[7], 9.99, 20, "V1B4gR9m2P6"),
        itemCreate("Tofu Cutlets", "Savory tofu cutlets", subcategories[7], 6.99, 25, "T5C2hR7k1L3"),
// Dairy
        // Dairy - Cheese
        itemCreate("Cheddar Cheese", "Sharp and flavorful cheddar cheese", subcategories[8], 3.99, 15, "C2H5dR7k1M3"),
        itemCreate("Swiss Cheese", "Smooth and nutty Swiss cheese", subcategories[8], 4.49, 12, "S4F9cM2j7T1"),
        itemCreate("Mozzarella Cheese", "Stretchy and creamy mozzarella cheese", subcategories[8], 3.79, 18, "M9B5zC1v3K7"),

        // Dairy - Butter
        itemCreate("Salted Butter", "Creamy salted butter", subcategories[9], 2.99, 20, "S2F5cB7m1T3"),
        itemCreate("Unsalted Butter", "Smooth unsalted butter", subcategories[9], 2.99, 22, "U9B2tS5m1C7"),
        itemCreate("Whipped Butter", "Light and airy whipped butter", subcategories[9], 3.29, 0, "W3H9pB5s1M7"),

        // Dairy - Milk
        itemCreate("Whole Milk", "Rich and creamy whole milk", subcategories[10], 1.99, 40, "W4C8mR3j6L9"),
        itemCreate("2% Milk", "Semi-skimmed 2% milk", subcategories[10], 1.79, 35, "S9K2cM4j6R8"),
        itemCreate("Skim Milk", "Fat-free skim milk", subcategories[10], 1.49, 30, "S1K6mL9c3R7"),

        // Dairy - Other
        itemCreate("Yogurt", "Creamy and tangy yogurt", subcategories[11], 2.49, 25, "Y5G2rT7k3M1"),
        itemCreate("Sour Cream", "Rich and tangy sour cream", subcategories[11], 1.99, 20, "S8F3mC6r9T2"),
        itemCreate("Cream Cheese", "Smooth and spreadable cream cheese", subcategories[11], 2.79, 18, "C3S6mR9f2T7"),
// Produce 
        // Produce - Fruit
        itemCreate("Apple", "Crisp and juicy apple", subcategories[12], 0.99, 50, "A2C5dR7k1M3"),
        itemCreate("Banana", "Sweet and ripe banana", subcategories[12], 0.49, 80, "B4H9cM2j7T1"),
        itemCreate("Orange", "Citrusy and refreshing orange", subcategories[12], 0.79, 60, "O6C3dH9p1R7"),

        // Produce - Vegetables
        itemCreate("Carrot", "Crunchy and nutritious carrot", subcategories[13], 0.69, 40, "C4S9mR2j6L8"),
        itemCreate("Broccoli", "Nutritious and vibrant broccoli", subcategories[13], 1.49, 25, "B5N2fH7m3G1"),
        itemCreate("Tomato", "Juicy and flavorful tomato", subcategories[13], 0.89, 30, "T8J4kL6p2V9"),

        // Produce - Other (Herbs and Spices)
        itemCreate("Basil", "Aromatic and versatile herb", subcategories[14], 1.99, 15, "B1S5hR8m2P6"),
        itemCreate("Cinnamon", "Warm and fragrant spice", subcategories[14], 0.79, 35, "C7N4nW2s6L9"),
        itemCreate("Rosemary", "Flavorful and aromatic herb", subcategories[14], 1.29, 0, "R3F6aH9m4S7"),
// Snacks
        // Snacks - Chips
        itemCreate("Potato Chips", "Classic crispy potato chips", subcategories[15], 1.99, 30, "P2C5dR7k1M3"),
        itemCreate("Tortilla Chips", "Crunchy tortilla chips", subcategories[15], 1.49, 25, "T4C9hM2j7R1"),
        itemCreate("Corn Chips", "Savory corn chips", subcategories[15], 1.29, 0, "C6S3mR9f1H7"),

        // Snacks - Crackers
        itemCreate("Saltine Crackers", "Light and crispy saltine crackers", subcategories[16], 1.29, 35, "S3C6rT9a1K7"),
        itemCreate("Cheese Crackers", "Cheesy and flavorful crackers", subcategories[16], 1.49, 30, "C5H2cR7k1F3"),
        itemCreate("Whole Wheat Crackers", "Nutty and wholesome whole wheat crackers", subcategories[16], 1.99, 25, "W9C4rT6k2M7"),

        // Snacks - Popcorn
        itemCreate("Butter Popcorn", "Classic butter-flavored popcorn", subcategories[17], 1.99, 30, "B2P5cR7k1M3"),
        itemCreate("Cheese Popcorn", "Cheesy and delicious popcorn", subcategories[17], 1.79, 25, "C4P9hM2j7R1"),
        itemCreate("Caramel Popcorn", "Sweet and crunchy caramel popcorn", subcategories[17], 2.29, 20, "C6S3mR9k1P7"),

        // Snacks - Other
        itemCreate("Pretzels", "Crunchy and salty pretzels", subcategories[18], 1.49, 35, "P3C6rT9z1L7"),
        itemCreate("Trail Mix", "Nutty and fruity trail mix", subcategories[18], 2.49, 30, "T5M2xR7l1K3"),
        itemCreate("Granola Bars", "Healthy and satisfying granola bars", subcategories[18], 1.99, 25, "G9B4rT6l2S7"),
// Candy 
        // Candy - Chocolate
        itemCreate("Milk Chocolate Bar", "Creamy and smooth milk chocolate", subcategories[19], 1.99, 30, "M2C5dR7k1B3"),
        itemCreate("Dark Chocolate Bar", "Rich and indulgent dark chocolate", subcategories[19], 2.49, 25, "D4C9hR2j7B1"),
        itemCreate("White Chocolate Bar", "Sweet and velvety white chocolate", subcategories[19], 2.29, 0, "W6C3hR9j1B7"),

        // Candy - Gummies
        itemCreate("Gummy Bears", "Classic fruity gummy bears", subcategories[20], 1.49, 35, "G3C6mR9f1B7"),
        itemCreate("Sour Gummy Worms", "Tangy and chewy sour gummy worms", subcategories[20], 1.79, 0, "S5G2mR7h1W3"),
        itemCreate("Fruit Gummy Rings", "Colorful and delicious fruit gummy rings", subcategories[20], 1.99, 25, "F9G4mR6h2B7"),

        // Candy - Hard Candy
        itemCreate("Peppermint Hard Candy", "Refreshing peppermint hard candy", subcategories[21], 0.99, 40, "P4H9cR2k6M8"),
        itemCreate("Fruit Flavored Hard Candy", "Assortment of fruity hard candies", subcategories[21], 1.49, 35, "F5H2cR7m3B1"),
        itemCreate("Butterscotch Hard Candy", "Smooth and buttery butterscotch candy", subcategories[21], 1.29, 30, "B9H4cR6k2M7"),

        // Candy - Other
        itemCreate("Licorice", "Chewy and flavorful licorice candy", subcategories[22], 1.49, 35, "L3C6mR9k1B7"),
        itemCreate("Cotton Candy", "Fluffy and sweet cotton candy", subcategories[22], 1.99, 30, "C5F2dR7y1M3"),
        itemCreate("Jelly Beans", "Colorful and fruity jelly beans", subcategories[22], 1.79, 25, "J9B4nR6s2M7")


    ])
}



// create single category
const categoryCreate = async(name, description) => {
    const category = new Category({name: name, description: description});
    categories.push(category);
    await category.save();
    console.log(`Added category: ${name}`);
}

// create single category 
const subcategoryCreate = async(name, description, parent_category) => {
    const subcategoryDetail = {
        name: name,
        description: description,
    }

    if (parent_category != false) subcategoryDetail.parent_category = parent_category

    const subcategoriesInstance = new Subcategory(subcategoryDetail);
    subcategories.push(subcategoriesInstance);
    await subcategoriesInstance.save()
    console.log(`Added subcategory ${name}`);
}

// create single item 
const itemCreate = async(name, description, parent_subcategory, price, number_in_stock, skew) => {

    const itemdetail = {
        name: name,
        description: description,
        price: price, 
        number_in_stock: number_in_stock,
        skew: skew,
    }

    if (parent_subcategory != false) itemdetail.parent_subcategory = parent_subcategory
    
    const iteminstance = new Item(itemdetail)
    items.push(iteminstance);
    await iteminstance.save();
    console.log(`Added item: ${name}, parent: ${itemdetail.parent_subcategory.name}`)
}