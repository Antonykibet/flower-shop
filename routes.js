const { log } = require('console');
const express = require('express')
const {MongoClient, ObjectId} = require('mongodb')
const routes = express.Router()
const path =require('path')
const uri = "mongodb+srv://antonykibet059:123Acosta@cluster0.eoos6vz.mongodb.net/?retryWrites=true&w=majority";

const dbClient = new MongoClient(uri)
let flowerCollection =null
let accountCollection =null

async function dbInit(){
    let db = dbClient.db('flowerShop');
    flowerCollection = await db.collection('flowers')
    accountCollection = await db.collection('accounts')
} 
routes.get('/role',(req,res)=>{
    if(req.session.user){
        const {role} = req.session.user 
        res.json(role)
        return
    }
    res.redirect('/')
})
routes.post('/login',async (req,res)=>{
    const {email,password} = req.body
    console.log(email,password)
    let user
    try{
        user = await accountCollection.findOne({email:email})
        if(!user){
            res.render('login',{wrongUser:'Wrong Username',wrongPass:''})
            return
        }

    }catch{
        res.render('login',{wrongUser:'Wrong Username' ,wrongPass:''})    
    }
    if(user.password !== password){
        res.render('login',{wrongUser:'',wrongPass:'Wrong Password'})
        return
    }
    if(email=='antonykibet059@gmail.com' && password=='123@Anto')req.session.user = {email,role:'Admin'}  
    res.redirect('/')
})

routes.get('/category/:page',async (req,res)=>{
    const {page} = req.params
    collection= await db.collection('flowers');
    // let product = await collection.findOne({catalogue:page})
     await res.render('page',{title:page})

})

routes.get('/allFlowers',async(req,res)=>{
    let result = await flowerCollection.find().toArray()
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
    let result = await flowerCollection.find({catalogue:`${product}`}).toArray()
    res.json(result)
})
routes.get('/product/:productID',async(req,res)=>{
    let {productID} =req.params
    let {image,name,description,price,images} = await flowerCollection.findOne(new ObjectId(productID))
    let details={
        image:image,
        images:JSON.stringify(images),
        name:name,
        description:description,
        price:price
    }
    await res.render('product',details)
})
routes.get('/getFlowers',async (req,res)=>{
    let result = await flowerCollection.find().toArray()
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
    res.render('login',{wrongUser:'',wrongPass:''})
})

routes.get('/signUp',(req,res)=>{
    res.render('sign',{error:''})
})
routes.post('/signUp',async(req,res)=>{
    const {firstname,lastname,email,password} = req.body
    if( await accountCollection.findOne({email:email})){
        res.render('sign',{error:'Email already exists!'})
        return
    }
    let user ={
        name:`${firstname} ${lastname}`,
        email:email,
        password:password,
    }
    await accountCollection.insertOne(user)
    console.log('Success')
    res.render('login',{wrongUser:'',wrongPass:''})
})
module.exports = {routes,dbInit}