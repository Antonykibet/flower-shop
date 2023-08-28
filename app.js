const { urlencoded } = require('body-parser')
const express = require('express')
const { get } = require('http')
const {MongoClient, ObjectId} = require('mongodb')
const path =require('path')

const app = express()
const PORT=3500
const uri = "mongodb+srv://antonykibet059:123Acosta@cluster0.eoos6vz.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri) 
let db = dbClient.db('flowerShop');
let flowersCollects =null

app.use(express.json())
app.use(express.urlencoded({extended:false}));
app.use(express.static('./public'))

app.get('/',async(req,res)=>{
    res.sendFile(path.join(__dirname,'/index.html'))
})
app.get('/allFlowers',async(req,res)=>{
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find().toArray()
    res.json(result)
})

app.get('/flower',(req,res)=>{
    res.sendFile(path.join(__dirname,'/product.html'))
})
app.get('/products/:product',async(req,res)=>{
    let {product} =req.params
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find({catalogue:`${product}`}).toArray()
    res.json(result)
})
app.get('/product/:productID',async(req,res)=>{
    let {productID} =req.params
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find( new ObjectId(Number(productID))).toArray()
    res.send('rada')
})






app.get('/getFlowers',async (req,res)=>{
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find().toArray()
    console.log(result)
    res.json(result)
})
app.get('/cart',(req,res)=>{
    res.sendFile(path.join(__dirname,'/cart.html'))
})
app.listen(PORT,async()=>{
    await dbClient.connect()
    console.log(`db connected...`)
    console.log(`Server listening at Port ${PORT}...`)
})