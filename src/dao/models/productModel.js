const { mongoose} = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    status: { type: Boolean, required: true },
    category: { type: String, required: true },
    thumbnails: [{ type: Array, required: true, default: [] }],
  },
  {
    collection: 'products', 
    timestamps: true,
    strict: true,
  }
);

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);


module.exports = Product;