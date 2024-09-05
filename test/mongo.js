const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const client = new MongoClient(
  process.env.DATABASE_URL.replace('<PASSWORD>', process.env.PASSWORD)
);

const createProduct = async (req, res, next) => {
  const newProduct = { name: req.body.name, price: req.body.price };

  try {
    await client.connect();
    const db = client.db();
    await db.collection('products').insertOne(newProduct);
  } catch (error) {
    return res.json({ message: 'Could not store data.' });
  } finally {
    client.close();
  }

  res.status(201).json(newProduct);
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    await client.connect();
    const db = client.db();
    products = await db.collection('products').find().toArray();
  } catch (error) {
    return res.json({ message: 'Could not retrieve data.' });
  } finally {
    client.close();
  }

  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
