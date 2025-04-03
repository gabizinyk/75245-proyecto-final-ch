const { Router } = require("express");
const CartManagerMongo = require("../dao/CartManagerMongo.js");
const { isCartWithId } = require("../middleware/cartValidations.js");
const { checkIdLength } = require("../middleware/idValidations.js");

const router = Router();

router.get("/:cid", checkIdLength, isCartWithId, async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await CartManagerMongo.getCartBy({ _id: cid });

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ cart });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await CartManagerMongo.createCart((products = {}));

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Carrito creado" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.post("/:cid/product/:pid", checkIdLength, isCartWithId, async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const newProductInCart = await CartManagerMongo.addProductToCart(cid, pid);
    res.status(201).json({ Msg: "Producto agregado correctamente al carrito" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
    console.log(error)
  }
});

router.delete("/:cid/product/:pid", checkIdLength, isCartWithId, async (req, res) => {
  const { cid, pid } = req.params;

  let existProduct = await CartManagerMongo.getCartBy({ _id: cid, 'products.product': pid});
  
  if(!existProduct) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Error: "El producto a eliminar no existe en el carrito" });
    return;
  }

  try {
    const deletedProductFromCart = await CartManagerMongo.deleteProductFromCart(
      cid,
      pid
    );
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Producto eliminado del carrito" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.delete("/:cid", checkIdLength, isCartWithId, async (req, res) => {
  const { cid } = req.params;

  try {
    const allProductsDeletedFromCart =
      await CartManagerMongo.deleteAllProductsFromCart(cid);
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Productos eliminados del carrito" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.put("/:cid", checkIdLength, isCartWithId, async (req, res) => {
  const { cid } = req.params;
  let { products } = req.body;

  if(!Array.isArray(products)){
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "Debe ser un array" });
    return;
  }

  const isValidArray = products.every(p => 
    typeof p.product == "string" &&
    p.product.length > 0 &&
    typeof p.quantity == "number" &&
    p.quantity > 0
  ) 

  if(!isValidArray){
    res.setHeader("Content-Type", "application/json")
    res.status(400).json({ Msg: "Los campos del array deben ser válidos" });
    return;
  }  

  try {
    const allProductsModified = await CartManagerMongo.modifyAllProductsInCart(
      cid,
      products
    );
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Productos modificados en el carrito" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  } 
});

router.put("/:cid/product/:pid", checkIdLength, isCartWithId, async (req, res) => {
  const { cid, pid } = req.params;
  let { newQuantity } = req.body;

  if (isNaN(newQuantity)) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El valor 'newQuantity' debe ser numérico" });
    return;
  } else {
    newQuantity = Number(newQuantity);
  }

  if (newQuantity === 0) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El valor 'newQuantity' debe ser mayor a 0" });
    return;
  }

  try {
    const quantityModified = await CartManagerMongo.modifyProductQuantityInCart(
      cid,
      pid,
      newQuantity
    );
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Se modificó la cantidad correctamente" });
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

module.exports = router;
