const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, required: true},
    parent_category: {type: Schema.Types.ObjectId, ref: "Category"},
})

SubcategorySchema.virtual("url").get(function () {
    return `/catalog/subcategory/${this._id}`;
})

module.exports = mongoose.model("Subcategory", SubcategorySchema);