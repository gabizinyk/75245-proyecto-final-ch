const { Router } = require("express");
const classProductManager = require("../dao/ProductManager");
const productManager = new classProductManager("./src/data/products.json");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ products });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.get("/:pid", async (req, res) => {
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

router.post("/", async (req, res) => {
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

  //Valida que no repita el parámetro 'code'
  const isCode = (products, code) => {
    return products.some((p) => p.code == code);
  };

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
    res.status(400).json({ Msg: "Todos los campos son obligatorios" });
    return;
  }

  if (isNaN(stock) || isNaN(price) || typeof status != "boolean") {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El valor del campo debe ser el indicado" });
    return;
  }

  if (isCode(await productManager.getProducts(), code)) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "Ya existe un producto con el mismo código" });
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

router.put("/:pid", async (req, res) => {
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

router.delete("/:pid", async (req, res) => {
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

module.exports = router;
