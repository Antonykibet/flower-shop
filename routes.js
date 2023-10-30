const express = require('express')
const routes = express.Router()
const path =require('path')
const {dbInit,accounts,products,orders,dashboard,subscription,ObjectId} = require('./mongoConfig');
const { log } = require('console');

 



function totalDeliveries(subscription,interval){
    if(subscription=='Monthly'&&interval=='weekly'){
        return 4;
    }
    if(subscription=='Monthly'&&interval=='fortnight'){
        return 2;
    }
    if(subscription=='Quartely'&&interval=='weekly'){
        return 16;
    }
    if(subscription=='Quartely'&&interval=='fortnight'){
        return 8;
    }
}
routes.get('/getSubItems',async (req,res)=>{
    let items = await subscription.find({email:req.session.email}).toArray()
    console.log(items)
    res.json(items)
})
routes.get('/subscribe',async(req,res)=>{
    res.sendFile(path.join(__dirname,'html','subscribe.html'))
})
routes.post('/subscribe',async(req,res)=>{
    let {name,phoneNo,note,intervals,product} = req.body
    product = JSON.parse(product)
    let subscribedItem={
        name,
        product:product.name,
        email:req.session.email,
        phoneNo,
        note,
        intervals,
        subscription:product.catalogue,
        deliveries:0,
        lastDelivery:null,
        nextDelivery:null,
        totalDeliveries:totalDeliveries(product.catalogue,intervals),
    }
    await subscription.insertOne(subscribedItem)
    res.redirect('back')
})
routes.post('/addCart',async(req,res)=>{
    const {cartItems} = req.body
    req.session.cartItems=cartItems
    await dashboard.updateOne({ _id: new ObjectId('652f3ad8c237523c7b489530')},{ $inc: {cartItems: 1 }})
    res.redirect('/')
})
routes.get('/addCart',(req,res)=>{
    if(req.session.cartItems){
        res.json(req.session.cartItems)
        return
    }
    req.session.cartItems=[]
    res.redirect('back')
})
routes.post('/updCart',(req,res)=>{
    const {cartItems} =req.body
    req.session.cartItems=cartItems
    res.redirect('/cart')
})
routes.get('/role',(req,res)=>{
    const permision={
        isAdmin:req.session.isAdmin ?? false,
        isUser:req.session.isUser ?? false
    } 
    res.json(permision)
})
routes.get('/isLogged',(req,res)=>{
    if(req.session.isUser){
        res.json(req.session.isUser)
        return
    }
    res.json(false)
})
routes.post('/login',async (req,res)=>{
    const {email,password} = req.body
    let user
    try{
        user = await accounts.findOne({email:email})
        if(!user){
            res.render('login',{wrongUser:'Wrong Username,',wrongPass:''})
            return
        }

    }catch{
        res.render('login',{wrongUser:'Wrong Username' ,wrongPass:''})    
    }
    if(user.password !== password){
        res.render('login',{wrongUser:'',wrongPass:'Wrong Password'})
        return
    }
    if(email=='antonykibet059@gmail.com' && password=='123@Anto'){
        req.session.isAdmin=true   
    }
    req.session.email=email
    req.session.isUser=true
    res.redirect('/')
})

routes.get('/category/:page',async (req,res)=>{
    const {page} = req.params
     await res.render('page',{title:page})
})

routes.get('/allFlowers',async(req,res)=>{
    let result = await products.find().toArray()
    res.json(result)
})

routes.get('/products/:product',async(req,res)=>{
    let {product} =req.params
    let result = await products.find({catalogue:`${product}`}).toArray()
    res.json(result)
})
routes.get('/product/:productID',async(req,res)=>{
    let {productID} =req.params
    let item  = await products.findOne(new ObjectId(productID))
    let {image,name,description,price,images,catalogue} =item
    let details={
        image:image,
        images:JSON.stringify(images),
        name:name,
        description:description,
        price:price,
        item:JSON.stringify(item)
    }
    
    await res.render('product',details)
})
routes.get('/getProducts',async (req,res)=>{
    let result = await products.find().toArray()
    res.json(result)
})
routes.get('/',async(req,res)=>{
    try {
        if(!req.session.visited){
            await dashboard.updateOne({ _id: new ObjectId('652f3ad8c237523c7b489530')},{ $inc: { visits: 1 }})
            req.session.visited=true
        }   
    } catch (error) {
        console.log(error)
    }
    res.sendFile(path.join(__dirname,'html','index.html'))
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
    if( await accounts.findOne({email:email})){
        res.render('sign',{error:'Email already exists!'})
        return
    }
    let user ={
        name:`${firstname} ${lastname}`,
        email:email,
        password:password,
    }
    await accounts.insertOne(user)
    console.log(`Account creation succesful:${user.name}`)
    res.render('login',{wrongUser:'',wrongPass:''})
})
routes.post('/checkout',async(req,res)=>{
    
    try {
        const {fname,lname,phoneNo,email,totalPrice} = req.body
        const cart = req.session.cartItems
        let order ={
            name:`${fname} ${lname}`,
            phoneNo,
            email,
            totalPrice,
            cart,
        }
        await orders.insertOne(order)
        req.session.cartItems=[]
        res.redirect('/')
    } catch (error) {
        console.log(`Failed CheckOut ${fname} ${lname}`)
        console.log(error)
    }
})
module.exports = {routes,dbInit}