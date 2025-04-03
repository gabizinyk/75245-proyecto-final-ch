const ProductManagerMongo = require('../dao/ProductManagerMongo');

const fieldValidations = (req, res, next) => {
  
    if (
    !req.body.title ||
    !req.body.description ||
    !req.body.code ||
    !req.body.price ||
    req.body.status == undefined ||
    req.body.status == null ||
    !req.body.stock ||
    !req.body.category ||
    !req.body.thumbnails
  ) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "Todos los campos son obligatorios" });
    return;
  }

  if (isNaN(req.body.stock) || isNaN(req.body.price)) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El valor del campo debe ser numérico" });
    return;
  }

  if (req.body.status === "true") {
    req.body.status = true;
  }

  if (req.body.status === "false") {
    req.body.status = false;
  }

  if (typeof req.body.status != "boolean") {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "El valor del campo debe ser tipo boolean" });
    return;
  }

  next();
};

const isProductWithSameCode = async (req, res, next) => {
    const product = await ProductManagerMongo.getProductsBy({code: req.body.code})
    
    if(product.code === req.body.code) {
        res.setHeader("Content-Type", "application/json");
        res.status(400).json({ Msg: "Ya existe un producto con el mismo código" });
        return;
    }


    next();
}

const isProductWithId = async (req, res, next) => {
  const product = await ProductManagerMongo.getProductsBy({_id: req.params.pid})

  if(product == null || product == undefined) {
    res.setHeader("Content-Type", "application/json");
        res.status(400).json({ Msg: "No existe el producto con el ID solicitado" });
        return;
  }

  next();
}

module.exports = {fieldValidations, isProductWithSameCode, isProductWithId};
