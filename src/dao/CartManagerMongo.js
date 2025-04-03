const Cart = require("./models/cartModel");

class CartManagerMongo {
  static async getCartBy(filter = {}) {
    return await Cart.findOne(filter).lean().populate("products.product");
  }

  static async createCart(products = {}) {
    return await Cart.create(products);
  }

  static async addProductToCart(cid, pid) {
    let cart = await this.getCartBy({ _id: cid });
    let quantity = 1;

    //Verifico si el producto existe
    const existProduct = cart.products.findIndex((i) => i.product._id == pid);

    //Si existe actualizo 'quantity'
    if (existProduct > -1) {
      cart.products[existProduct].quantity += quantity;
    } else {
      //Sino agrego el producto
      cart.products.push({
        product: {
          _id: pid,
        },
        quantity: 1,
      });
    }

    return await cart.save();
  }

  static async modifyProductQuantityInCart(cid, pid, newQuantity) {
    const productModified = await Cart.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      {
        $set: { "products.$.quantity": newQuantity },
      },
      { new: true }
    );
  }

  static async modifyAllProductsInCart(cid, newProducts) {
    const productsModified = await Cart.findOneAndUpdate(
      { _id: cid },
      {
        $set: { products: newProducts },
      },
      { 
        new: true
      }
    )
  }

  static async deleteProductFromCart(cid, pid) {
    const productDeleted = await Cart.findOneAndUpdate(
      { _id: cid },
      {
        $pull: { products: { product: pid } },
      },
      {
        new: true,
      }
    );
  }

  static async deleteAllProductsFromCart(cid) {
    const productsDeleted = await Cart.findOneAndUpdate(
      { _id: cid },
      {
        $set: { products: [] },
      },
      { 
        new: true
      }
    );
  }
}

module.exports = CartManagerMongo;
