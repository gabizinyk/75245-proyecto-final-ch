const express = require('express')
const classProductManager = require('./dao/ProductManager.js')
const productManager = new classProductManager ('./src/data/products.json')

const app = express()
const PORT = 8000

app.get('/api/products',async (req, res) => {
    let products = await productManager.getProducts()
    res.send(products)
})

app.listen(PORT, () => {
    console.log(`Ejecutando app en el puerto ${PORT}`)
})