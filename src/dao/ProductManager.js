const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

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
    let product = JSON.parse(products).find((p) => p.id === pid);

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
    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      console.log("Deben ser ingresados todos los campos");
      return;
    }
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
    let productAdded = JSON.stringify(data, null, 3);

    await fs.writeFile(this.path, productAdded, "utf-8");
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
    if (!pid || pid === "") {
      console.log("Se debe ingresar un ID");
      return;
    }

    let products = await this.getProducts();
    let data = JSON.parse(products);

    data.map((p) => {
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

    let productModified = JSON.stringify(data, null, 3);

    await fs.writeFile(this.path, productModified, "utf-8");
  }

  async deleteProduct(pid){
    if(!pid){
      console.log("Se debe ingresar un ID");
      return;
    }

    let products = await this.getProducts();
    let data = JSON.parse(products);

    let productDeleted = JSON.stringify(data.filter((p) => p.id !== pid), null, 3)

    await fs.writeFile(this.path, productDeleted, "utf8")
  }
}

module.exports = ProductManager;
