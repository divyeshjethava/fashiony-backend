import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
  _id: { 
    type: String, 
    required: true 
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['bs'], 
    required: true,
  },
name: String,
description: String,
category: String,

stockQuantity: Number,
regularPrice: Number,
salePrice: Number,
tag: String,
images: [String]


});


const Product = mongoose.model('Product', productSchema);
export default Product;

