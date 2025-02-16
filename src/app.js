const express = require("express");
const classProductManager = require("./dao/ProductManager.js");
const productManager = new classProductManager("./src/data/products.json");

const app = express();
app.use(express.json());
const PORT = 8000;

app.get("/api/products", async (req, res) => {
  let products = await productManager.getProducts();
  res.status(200).send(products);
});

app.get("/api/products/:pid", async (req, res) => {
  let { pid } = req.params;
  let product = await productManager.getProductsById(pid);

  if (!product) {
    res.status(404).send("No existe el producto");
    return;
  }

  res.status(200).send(product);
});

app.post("/api/products", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;
  await productManager.addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );
 
  res.status(200).send("Producto agregado exitosamente");
});

app.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
});
