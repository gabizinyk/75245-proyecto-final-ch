const { Router } = require("express");
const ProductManagerMongo = require("../dao/ProductManagerMongo");
const CartManagerMongo = require("../dao/CartManagerMongo");
const { isCartWithId } = require("../middleware/cartValidations");
const router = Router();

router.get("/products", async (req, res) => {
  let {
    docs: products,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  } = await ProductManagerMongo.getProducts(1, 10, 1);
  res.render("index", {
    products,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  });
});

router.get("/carts/:cid", isCartWithId, async (req, res) => {
  let { cid } = req.params;

  let { products } = await CartManagerMongo.getCartBy({ _id: cid });
  res.render("cart", { products, cid });
});

router.get("/realTimeProducts", async (req, res) => {
  let {
    docs: products,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  } = await ProductManagerMongo.getProducts(1, 10, 1);
  res.render("realTimeProducts", {
    products,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  });
});

router.get("/uploads", async (req, res) => {
  res.render("uploads");
});

module.exports = router;
