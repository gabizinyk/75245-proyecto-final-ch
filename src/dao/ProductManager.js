const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    if (!this.path) {
      return [];
    }

    const products = await fs.readFile(this.path, "utf-8");
    return JSON.parse(products);
  }

  async getProductsById(pid) {
    let products = await this.getProducts();

    let product = products.find((p) => p.id == pid);

    if (product === undefined) {
      return [];
    }

    return product;
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
    let products = await this.getProducts();

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

    products.push(newProduct);
    let productAdded = JSON.stringify(products, null, 3);

    await fs.writeFile(this.path, productAdded, "utf-8", (err) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log("Se escribió el archivo correctamente");
    });
  }

  async modifyProduct(
    pid,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    let products = await this.getProducts();

    products.map((p) => {
      if (p.id === pid) {
        p.title = title || p.title;
        p.description = description || p.description;
        p.code = code || p.code;
        p.price = price || p.price;
        p.status = status || p.status;
        p.stock = stock || p.stock;
        p.category = category || p.category;
        p.thumbnails = thumbnails || p.thumbnails;
      }
    });

    let productModified = JSON.stringify(products, null, 3);

    await fs.writeFile(this.path, productModified, "utf-8", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Se escribió el archivo correctamente");
    });
  }

  async deleteProduct(pid) {
    let products = await this.getProducts();

    let productDeleted = JSON.stringify(
      products.filter((p) => p.id != pid),
      null,
      3
    );

    await fs.writeFile(this.path, productDeleted, "utf8", (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Se escribió el archivo correctamente");
    });
  }
}

module.exports = ProductManager;
