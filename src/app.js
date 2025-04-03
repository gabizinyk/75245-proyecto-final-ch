const express = require("express");
const productRouter = require("./routes/productRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const uploadsRouter = require("./routes/uploadRoutes.js");
const viewsRouter = require("./routes/viewsRoutes.js");
const path = require('path');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const { createServer } = require('http');
const connectDB = require("./config/database.js");

const app = express();
const server = createServer(app);
const io = new Server(server);
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views',path.join(__dirname + '/views'))
app.use(express.static(__dirname + '/public')) 

app.use("/api/products", (req, res, next) => {
  req.io = io;
  next();
}, productRouter);

app.use("/api/carts", cartRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/", viewsRouter);

//Conexión con DB
connectDB();

server.listen(PORT, () => {
  console.log(`Ejecutando app en el puerto ${PORT}`);
});
