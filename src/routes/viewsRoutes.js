const { Router } = require("express");
const ProductManagerMongo = require("../dao/ProductManagerMongo");
const CartManagerMongo = require("../dao/CartManagerMongo");
const { isCartWithId } = require("../middleware/cartValidations");
const router = Router();

router.get("/products", async (req, res) => {
  let { page, limit } = req.query;

  if (!page) {
    page = 1;
  }

  if (!limit) {
    limit = 10;
  }

  let {
    docs: products,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  } = await ProductManagerMongo.getProducts(page, limit);
  res.render("index", {
    products,
    totalPages,
    hasNextPage,
    nextPage,
    hasPrevPage,
    prevPage,
  });
});

router.get("/carts/:cid", isCartWithId, async (req,res) => {
  let { cid } = req.params;

  let { products } = await CartManagerMongo.getCartBy({_id: cid}); 

  if(!products) {}

  console.log(products)
  
  res.render("cart", { products, cid });
});

/* router.get("/realTimeProducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", {products});
}); */

router.get("/uploads", async (req, res) => {
  res.render("uploads");
});

module.exports = router;
