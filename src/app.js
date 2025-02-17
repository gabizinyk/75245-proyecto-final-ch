const express = require("express");
const classProductManager = require("./dao/ProductManager.js");
const productManager = new classProductManager("./src/data/products.json");

const app = express();
app.use(express.json());
const PORT = 8000;

//Products
app.get("/api/products", async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).send(products);
});

app.get("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductsById(pid);

  if (!product) {
    res.status(404).send("No existe el producto");
    return;
  }

  res.status(200).send(product);
});

app.post("/api/products", async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } =
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

app.put("/api/products/:pid", async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } =
    req.body;
  const { pid } = req.params;

  await productManager.modifyProduct(
    pid,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  );

  res.status(201).send("Producto modificado satisfactoriamente");
});

app.delete("/api/products/:pid", async(req, res) => {
  const {pid} = req.params

  await productManager.deleteProduct(pid)

  res.status(201).send("Producto eliminado satisfactoriamente")
})

//Cart

app.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
});
