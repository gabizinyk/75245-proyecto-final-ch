const Product = require('./models/productModel');

class ProductManagerMongo {
  static async getProducts(page, limit) {
    return await Product.paginate({}, { page: page, limit: limit , lean: true});
  }

  static async getProductsBy(filter={}) {
    return await Product.findOne(filter);
  }

  static async addProduct(product) {
    let newProduct = await Product.create(product);

    return newProduct;
  }

  static async modifyProduct(id = {}, modification = {}) {
    let productModified = await Product.findOneAndUpdate(id, modification);

    return productModified;
  }

  static async deleteProduct(pid = {}) {
    return await Product.findByIdAndDelete(pid)
  }
}

module.exports = ProductManagerMongo;
