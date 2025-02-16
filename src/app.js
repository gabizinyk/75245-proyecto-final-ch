const express = require("express");
const classProductManager = require("./dao/ProductManager.js");
const productManager = new classProductManager("./src/data/products.json");

const app = express();
const PORT = 8000;

app.get("/api/products", async (req, res) => {
  let products = await productManager.getProducts();
  res.status(200).send(products);
})

app.get("/api/products/:pid", async (req, res) => {
  let {pid} = req.params
  let product = await productManager.getProductsById(pid)
  res.send(product)
})

app.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
})
