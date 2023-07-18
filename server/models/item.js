const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, required: true},
    parent_subcategory: {type: Schema.Types.ObjectId, ref: "Subcategory"},
    price: {type: Number, required: true},
    number_in_stock: {type: Number, required: true},
    skew: {type: String, required: true},
})

ItemSchema.virtual("price_to_usd").get(function() {
    return this.price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    })
})

ItemSchema.virtual("url").get(function() {
    return `/catalog/item/${this._id}`
})

module.exports = mongoose.model("Item", ItemSchema);