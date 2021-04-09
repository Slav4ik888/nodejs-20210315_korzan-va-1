const Product = require('../models/Product');
const mongoose = require('mongoose');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  console.log('START productsBySubcategory');
  const {subcategory} = ctx.query;
  console.log('ctx.query: ', ctx.query);

  if (!subcategory) return next();

  const products = await Product.find({ subcategory: subcategory }).limit(20);
  ctx.body = { products: products.map(mapProduct) };
};

module.exports.productList = async function productList(ctx, next) {
  console.log(`START productList`);
  const products = await Product.find().limit(20);

  ctx.body = { products: products.map(mapProduct) };
};

module.exports.productById = async function productById(ctx, next) {
  console.log(`START productById`);

  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, 'invalid product id');
  }

  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.throw(404, `no product with ${ctx.params.id} id`);
  }

  ctx.body = { product: mapProduct(product) };
};

