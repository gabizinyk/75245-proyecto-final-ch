const express = require("express");
const classProductManager = require("./dao/ProductManager.js");
const productManager = new classProductManager("./src/data/products.json");
const classCartManager = require("./dao/CartManager.js");
const cartManager = new classCartManager("./src/data/carts.json");

const app = express();
const PORT = 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Products

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ products });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProductsById(pid);

    if (product.length == 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ Error: "No se encontro el producto" });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ product });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.post("/api/products", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    !status ||
    !stock ||
    !category ||
    !thumbnails
  ) {
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Todos los campos son obligatorios" });
    return;
  }

  console.log(isNaN(price));
  console.log(isNaN(stock));

  if (isNaN(stock) || isNaN(price) || typeof status != "boolean") {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El valor del campo debe ser el indicado" });
    return;
  }

  try {
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

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Se añadió el producto correctamente" });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const { pid } = req.params;

  //Valido primero si el producto existe
  const product = await productManager.getProductsById(pid);

  if (product.length == 0) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).json({ Msg: "No se encontró el producto" });
    return;
  }

  try {
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

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Producto modificado satisfactoriamente" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  const { pid } = req.params;

  //Valido primero si el producto existe
  const product = await productManager.getProductsById(pid);

  if (product.length == 0) {
    res.setHeader("Content-Type", "application/json");
    res.status(404).json({ Msg: "No se encontró el producto" });
    return;
  }

  try {
    await productManager.deleteProduct(pid);

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Se eliminó el producto correctamente" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

//Carts

app.get("/api/carts/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);

    if (cart.length == 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ Msg: "No se encontro el carrito" });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ cart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.post("/api/carts", async (req, res) => {
  try {
    await cartManager.createCart();
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Carrito creado" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.post("/api/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await cartManager.addProductToCart(cid, pid);
    res.status(201).json({ Msg: "Agregado correctamente" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
});
