# Inventory 
This is an Express website from [TOP](https://www.theodinproject.com/lessons/nodejs-inventory-application). Its the first project using Express and the requirments are pretty simple.  
## Requirments 
```
Your Inventory app should have categories and items, so when the user goes to the home-page they can choose a category to view, and then get a list of every item in that category. You should include all of the CRUD methods for both items and categories, so anybody that’s visiting the site can Create, Read, Update or Delete any Item or Category.
```

I did a grocery store type website and most of the categories like "Meats, Drinks, Dairy" were too broad so I made subcategories for specifity. Now Drinks has "Soda", "Sports Drinks", "Energy Drinks", and "Other" which could be expanded as needed.  All CRUD operations are there and organized into neat routes. 
### Other Information
This project has a lot of images included. I started by using a Google Images API but the limit was hit incredibly quick and not feasible. I wrote a script to query the database and download every image for the collections. If you are intrested in that it is in server/api/google_images.js. It was not perfect and I did not test it before using it but it did save me a ton of time. 
## How to run locally
In server/ do
    ```npm install```
To run in dev 
    ```npm run devstart```
else 
    ```npm run start```


