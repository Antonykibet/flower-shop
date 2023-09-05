const { urlencoded } = require('body-parser')
const express = require('express')
const {readFile} = require('fs')
const { get } = require('http')
const {routes,dbClient} = require('./routes.js')

const app = express()
const PORT=3500


app.use(express.static('./public'))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(routes)




app.listen(PORT,async()=>{
    await dbClient.connect()
    console.log(`db connected...`)
    console.log(`Server listening at Port ${PORT}...`)
})