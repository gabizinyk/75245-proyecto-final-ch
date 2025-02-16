const fs = require("fs/promises");

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const products = await fs.readFile(this.path, "utf-8")
      return products
    } catch (error) {
      console.log(error)
    }
  }

  async getProductsById(pid) {
    if (!pid) {
      console.log("No se ha ingresado un ID");
      return
    }

    let products = await this.getProducts()
    let product = JSON.parse(products, null).find(p => p.id === Number(pid))

    return (!product) ? console.log('No existe el producto') : product   
  }

  /* async addProducts(){
        const products = this.getProducts()
    } */
}

module.exports = ProductManager;
