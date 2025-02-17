const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCartById(cid) {
    if (!cid) {
      console.log("Se necesita ingresar un ID");
      return;
    }

    const carts = await fs.readFile(this.path, "utf-8");
    const cart = JSON.parse(carts).find((c) => c.id === cid);

    if (!cart || cart === "") {
      console.log("No se encontro el carrito solicitado");
      return;
    }

    return cart;
  }
}
