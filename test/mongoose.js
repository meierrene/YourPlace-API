const mongoose = require('mongoose');
const Product = require('./product');
require('dotenv').config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log('Connected to database'))
  .catch(() => console.log('Failed to connect to database'));

const createProduct = async (req, res, next) => {
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });
  const result = await createdProduct.save();
  res.json(result);
};

const getProducts = async (req, res, next) => {
  const products = await Product.find().exec();
  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
