const express = require('express')
const router = express.Router()
const path =require('path')
const authRoute = require('./auth.js')
const processMpesa  = require('./payment.js')
const {dbInit,accounts,products,orders,dashboard,subscription,ObjectId} = require('./mongoConfig');


router.use(authRoute)
 



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
router.get('/getSubItems',async (req,res)=>{
    let items = await subscription.find({email:req.session.email}).toArray()
    console.log(items)
    res.json(items)
})
router.get('/subscribe',async(req,res)=>{
    res.sendFile(path.join(__dirname,'html','subscribe.html'))
})
router.post('/subscribe',async(req,res)=>{
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
router.post('/addCart',async(req,res)=>{
    const {cartItems} = req.body
    req.session.cartItems=cartItems
    await dashboard.updateOne({ _id: new ObjectId('652f3ad8c237523c7b489530')},{ $inc: {cartItems: 1 }})
    res.redirect('/')
})
router.get('/addCart',(req,res)=>{
    if(req.session.cartItems){
        res.json(req.session.cartItems)
        return
    }
    req.session.cartItems=[]
    res.redirect('back')
})
router.post('/updCart',(req,res)=>{
    const {cartItems} =req.body
    req.session.cartItems=cartItems
    res.redirect('/cart')
})
router.get('/role',(req,res)=>{
    const permision={
        isAdmin:req.session.isAdmin ?? false,
        isUser:req.session.isUser ?? false
    } 
    res.json(permision)
})
router.get('/isLogged',(req,res)=>{
    if(req.session.isUser){
        res.json(req.session.isUser)
        return
    }
    res.json(false)
})

router.get('/category/:page',async (req,res)=>{
    const {page} = req.params
     await res.render('page',{title:page})
})

router.get('/topProducts',async(req,res)=>{
    let result = await products.find({top:true}).toArray()
    res.json(result)
})

router.get('/products/:product',async(req,res)=>{
    let {product} =req.params
    let isLandingpage = req.headers.fromlandingpage
    if(isLandingpage){
        let result = await products.find({catalogue: `${product}`}).limit(7).toArray(); //get a limmited  number of document
        res.json(result) 
        return
    }
    let result = await products.find({catalogue:`${product}`}).toArray()
    res.json(result)
})
router.get('/product/:productID',async(req,res)=>{
    let {productID} =req.params
    //console.log(req.params)
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
router.get('/getProducts',async (req,res)=>{
    let result = await products.find().toArray()
    res.json(result)
})
router.get('/',async(req,res)=>{
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
router.get('/cart',(req,res)=>{
    res.sendFile(path.join(__dirname,'html','cart.html'))
})
router.get('/login',(req,res)=>{
    res.render('login',{wrongUser:'',wrongPass:''})
})

router.get('/signUp',(req,res)=>{
    res.render('sign',{error:''})
})

router.post('/paycallback', (req, res) => {
  console.log('...............callbackurl............')
  console.log(req.body);
  res.send('ok');
})
router.post('/checkout',async(req,res)=>{
    try {
        const {fname,lname,phoneNo,email,totalPrice,payment_method} = req.body
        if(payment_method == 'mpesa'){
            await processMpesa('254769819306')
        }
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
        
        console.log(error)
    }
})
module.exports = router