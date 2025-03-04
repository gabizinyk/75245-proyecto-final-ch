const express = require("express");
const handlebars = require('express-handlebars');
const productRouter = require("./routes/productRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const uploadsRouter = require("./routes/uploadRoutes.js");

const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', './src/views')
app.use(express.static('/views')) 

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/uploads", uploadsRouter);

app.get("/", (req, res) => {
  res.render('index');
  res.setHeader("Content-Type", "text/html");
  res.status(200)
});

app.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
});
