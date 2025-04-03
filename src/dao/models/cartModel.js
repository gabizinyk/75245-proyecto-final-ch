const { mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
          },
          quantity: {type: Number, min: 1, default: 1}
        },
      ],
    },
  },
  {
    collection: "carts",
    timestamps: true,
    strict: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
