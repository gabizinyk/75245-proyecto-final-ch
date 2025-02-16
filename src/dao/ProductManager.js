const fs = require("fs/promises");
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.path, "utf-8");
      return products;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsById(pid) {
    if (!pid) {
      console.log("No se ha ingresado un ID");
      return;
    }

    let products = await this.getProducts();
    let product = JSON.parse(products, null).find((p) => p.id === Number(pid));

    return !product ? console.log("No existe el producto") : product;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    // Validaciones
    let products = await this.getProducts();
    let data = JSON.parse(products);

    let newProduct = {
      id: uuidv4(),
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    };

    data.push(newProduct);
    let productAdded = JSON.stringify(data);

    await fs.writeFile(this.path, productAdded, "utf-8");
  }
}

module.exports = ProductManager;
