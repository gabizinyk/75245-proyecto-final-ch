const { Router } = require("express");
const classProductManager = require("../dao/ProductManager");
const productManager = new classProductManager("./src/data/products.json");
const router = Router();

router.get("/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {products});
});

router.get("/realTimeProducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {products});
});

router.get("/uploads", async (req, res) => {
  res.render("uploads");
});

module.exports = router;