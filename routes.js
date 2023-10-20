const express = require('express')
const routes = express.Router()
const path =require('path')
const {dbInit,accounts,products,orders,dashboard,ObjectId} = require('./mongoConfig')

 




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
    if(req.session.user){
        const {role} = req.session.user 
        res.json(role)
        return
    }
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
        req.session.user = {email,role:'Admin'}
        res.redirect('/')
        return    
    }
    req.session.user = {email,role:'user'}  
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
    let {image,name,description,price,images} = await products.findOne(new ObjectId(productID))
    let details={
        image:image,
        images:JSON.stringify(images),
        name:name,
        description:description,
        price:price
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