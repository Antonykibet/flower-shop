const express = require('express')
const {MongoClient, ObjectId} = require('mongodb')
const routes = express.Router()
const path =require('path')
const uri = "mongodb+srv://antonykibet059:123Acosta@cluster0.eoos6vz.mongodb.net/?retryWrites=true&w=majority";

const dbClient = new MongoClient(uri) 
let db = dbClient.db('flowerShop');
let flowersCollects =null

routes.get('/category/:page',async (req,res)=>{
    const {page} = req.params
    flowersCollects= await db.collection('flowers');
    // let product = await flowersCollects.findOne({catalogue:page})
     await res.render('page',{title:page})

})

routes.get('/allFlowers',async(req,res)=>{
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find().toArray()
    res.json(result)
})

routes.get('/flower',(req,res)=>{
    // res.sendFile(path.join(__dirname,'/product.html'))
    readFile('product.html','utf-8',(err,html)=>{
        if(err){
            res.status(404).sendFile(path.join(__dirname,'/fail.html'))
            return
        }
        res.send(html)
    })
})
routes.get('/products/:product',async(req,res)=>{
    let {product} =req.params
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find({catalogue:`${product}`}).toArray()
    res.json(result)
})
routes.get('/product/:productID',async(req,res)=>{
    let {productID} =req.params
    flowersCollects= await db.collection('flowers');
    let {image,name,description,price,images} = await flowersCollects.findOne(new ObjectId(productID))
    // if (!product) {
    //     // Handle case where product is not found
    //     return res.status(404).send('Product not found');
    // }
     await res.render('product',{image:image,images:JSON.stringify(images),name:name,description:description,price:price})
})
routes.get('/getFlowers',async (req,res)=>{
    flowersCollects= await db.collection('flowers');
    let result = await flowersCollects.find().toArray()
    console.log(result)
    res.json(result)
})
routes.get('/',async(req,res)=>{
    res.sendFile(path.join(__dirname,'html','index.html') )
})
routes.get('/cart',(req,res)=>{
    res.sendFile(path.join(__dirname,'html','cart.html'))
})
routes.get('/login',(req,res)=>{
    res.render('login',{errMsg:'wasssuuh'})
})

module.exports = {routes,dbClient}