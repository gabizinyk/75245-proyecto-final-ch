const { Router } = require("express");
const ProductManagerMongo = require("../dao/ProductManagerMongo");
const {
  fieldValidations,
  fieldModifyValidations,
  isProductWithSameCode,
  isProductWithId,
} = require("../middleware/productValidations");
const { checkIdLength } = require("../middleware/idValidations");

const router = Router();

router.get("/", async (req, res) => {
  let { limit, page, sort } = req.query;

  try {
    if (limit) {
      limit = Number(limit);

      if (isNaN(limit)) {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ Msg: "El limit debe ser numérico" });
        return;
      }

      let products = await ProductManagerMongo.getProducts(page || 1, limit, sort || 1);

      res.setHeader("Content-Type", "application/json");
      res.status(200).json(products);
      return;
    }

    if (page) {
      page = Number(page);

      if (isNaN(page)) {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ Msg: "El page debe ser numérico" });
        return;
      }

      let products = await ProductManagerMongo.getProducts(page, limit || 10, sort || 1);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(products);
      return;
    }

    if (sort) {
      if(sort != 'asc' && sort != 'desc') {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ Msg: "El ordenamiento debe ser 'asc' o 'desc'" });
        return;
      }

      if(sort.toLowerCase() === 'asc'){
        let products = await ProductManagerMongo.getProducts(page || 1, limit || 10, 1);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(products);
        return;
      } else {
        let products = await ProductManagerMongo.getProducts(page || 1, limit || 10, -1);
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(products);
        return;
      }
    } 

    let products = await ProductManagerMongo.getProducts(1, 10, 1);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(products);
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
    console.log(err)
  }
});

router.get("/:pid", checkIdLength, async (req, res) => {
  const { pid } = req.params;

  try {
    const product = await ProductManagerMongo.getProductsBy({ _id: pid });

    if (product == null) {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({ Msg: "No se encuentra el producto" });
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(product);
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

router.post("/", fieldValidations, isProductWithSameCode, async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body;

  try {
    let product = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    await ProductManagerMongo.addProduct(product);

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Se añadió el producto correctamente" });

    //Emito el evento para que se actualice la lista de productos en tiempo real
    req.io.emit("newProducts");
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
    console.log(err);
  }
});

router.put("/:pid", checkIdLength, isProductWithId, fieldModifyValidations, async (req, res) => {
  let {
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

  try {
    await ProductManagerMongo.modifyProduct({_id: pid}, {
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    });

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Producto modificado satisfactoriamente" });
  } catch (err) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
    console.log(err)
  }
});

router.delete("/:pid", checkIdLength, isProductWithId, async (req, res) => {
  const { pid } = req.params;

  try {
    await ProductManagerMongo.deleteProduct({_id: pid});

    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ Msg: "Se eliminó el producto correctamente" });

    //Emito el evento para que se actualice la lista de productos en tiempo real
    req.io.emit("deletedProducts");
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({ Error: "Error del servidor" });
  }
});

module.exports = router;
