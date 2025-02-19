const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCartById(cid) {
    const carts = await fs.readFile(this.path, "utf-8");
    const cart = JSON.parse(carts).find((c) => c.id === cid);

    if (cart == undefined) {
      return [];
    }

    return cart.products;
  }

  async createCart() {
    let carts = JSON.parse(await fs.readFile(this.path, "utf-8"));

    let newCart = {
      id: uuidv4(),
      products: [],
    };

    carts.push(newCart);
    let cartAdded = JSON.stringify(carts, null, 3);

    await fs.writeFile(this.path, cartAdded, "utf-8", (err) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log("Se escribió el archivo correctamente");
    });
  }

  async addProductToCart(cid, pid) {
    let carts = JSON.parse(await fs.readFile(this.path, "utf-8"));
    let newProduct = { id: pid, quantity: 1 };

    carts.forEach((c) => {
      if (c.id == cid) {
        if (c.products.length > 0) {
          c.products.forEach((p) => {
            if (p.id == pid) {
              p.quantity += 1;
            }
          });
          return;
        }

        c.products.push(newProduct);
      }
    });

    await fs.writeFile(
      this.path,
      JSON.stringify(carts, null, 3),
      "utf-8",
      (err) => {
        if (err) {
          console.log("Error de escritura en el archivo");
          return;
        }
        console.log("Archivo escrito satisfactoriamente");
      }
    );
  }
}

module.exports = CartManager;
