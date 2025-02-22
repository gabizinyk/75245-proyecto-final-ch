const {Router} = require("express");
const classCartManager = require("../dao/CartManager.js");
const cartManager = new classCartManager("./src/data/carts.json");

const router = Router();

router.get("/:cid", async (req, res) => {
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

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Carrito creado" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    await cartManager.addProductToCart(cid, pid);
    res.status(201).json({ Msg: "Agregado correctamente" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

module.exports = router;
