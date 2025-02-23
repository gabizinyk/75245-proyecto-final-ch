const express = require("express");
const productRouter = require("./routes/productRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const uploadsRouter = require("./routes/uploadRoutes.js");

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/uploads", uploadsRouter);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).json("OK");
});

app.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
});
