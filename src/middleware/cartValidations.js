const CartManagerMongo = require("../dao/CartManagerMongo");

const isCartWithId = async (req, res, next) => {
  const cart = await CartManagerMongo.getCartBy({ _id: req.params.cid });

  if (cart == null || cart == undefined) {
    res.setHeader("Content-Type", "application/json");
    res.status(400).json({ Msg: "No existe el cart con ID solicitado" });
    return;
  }

  next();
};

module.exports = { isCartWithId };
