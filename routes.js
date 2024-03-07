const express = require('express')
const router = express.Router()
const path =require('path')
const authRoute = require('./auth.js')
const axios = require("axios");

const processMpesa  = require('./safaricomAPI.js')
const processPesaPal = require('./pesapal.js')
const {mailOrder} = require('./mailer')
const {dbInit,accounts,products,orders,dashboard,subscription,ObjectId, events} = require('./mongoConfig');


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
router.get('/ipnPP',(req,res)=>{
    console.log('Aloooooooooooooooooooooooooo!!')
    console.log(req.body)
})
router.get('/testPesapal',async(req,res)=>{
    console.log('Test PESA PAL!!')
    let redirect_url = await processPesaPal()
    res.redirect(redirect_url)
})
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
    if(req.session.user){
        const user = req.session.user 
        res.json(user)
        return
    }
})
router.get('/isLogged',(req,res)=>{
    let url = req.headers.referer
    if(req.session.user){
        res.json(true)
        return
    }
    req.session.productUrl = url;
    res.json(false)
})

router.get('/searchResults',async (req, res) => {
    const { search } = req.query; 
    if(search === ''){
        return
    }
    const pipeline=[
        {
            $search:{
                index: "default",
                text: {
                  query: search,
                  path: ['name','description','catalogue'],
                  fuzzy: {
                    maxEdits: 2,
                  },
                },
                highlight:{
                  path:'description'
                }
              }
        },
        {
            $project:{
                name:1,
                description:1,
                score:{
                    $meta: "searchScore"
                },
            }
        }
    ]
    const results = await products.aggregate(pipeline).toArray();
    res.json(results)
});

router.get('/category/:page',async (req,res)=>{
    const {page} = req.params
    res.render('page',{title:page})
})

router.get('/topProducts',async(req,res)=>{
    let result = await products.find({top:true}).toArray()
    res.json(result)
})

router.get('/products/:product',async(req,res)=>{
    let {product} =req.params
    let searchTerm =product
    let isLandingpage = req.headers.fromlandingpage
    if(isLandingpage){
        let result = await products.find({catalogue: { $regex: new RegExp(searchTerm, "i") }}).limit(7).toArray(); //get a limmited  number of document
        res.json(result) 
        return
    }
    let result = await products.find({catalogue:{ $regex: new RegExp(searchTerm, "i") }}).toArray()
    res.json(result)
})
router.get('/product/:productID',async(req,res)=>{
    let {productID} =req.params
    let item  = await products.findOne(new ObjectId(productID))
    let {_id,image,name,description,price,images,catalogue} =item
    let details={
        _id,
        image:image,
        images:JSON.stringify(images),
        name:name,
        description:description,
        price:price,
        item:JSON.stringify(item)
    }
    
    res.render('product',details)
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
router.get('/getEvents',async(req,res)=>{
    try {
        let eventsData = await events.find().toArray()
        res.json(eventsData)
    } catch (error) {
        console.log(`Error at /getEvents:${error}`)
        res.json(error)
    }
})
router.get('/events',(req,res)=>{
    res.sendFile(path.join(__dirname,'html','events.html'))
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

router.get('/pesapalCall', (req, res) => {
  console.log('...............callbackurl............')
  console.log(req.body);
  res.sendFile(path.join(__dirname,'html','paySuccsfull.html'));
})
router.post('/cartDetails',async(req,res)=>{
    let totalPrice = 0
    let productDetails = []
    const cartDetails = req.body
    for (const item of cartDetails) {
        try {
          const { price,name } = await products.findOne({ _id: new ObjectId(item.id) });
          productDetails.push({
            _id:item.id,
            name,
            unit:item.unit
          })
          totalPrice += price * item.unit;
        } catch (error) {
          console.log(`Error in /cartDetails ${error}`)
        }
      }
      req.session.productDetails = productDetails
      req.session.totalPrice = totalPrice
      res.json('CHONJO')
})
router.post('/checkout',async(req,res)=>{
    console.log(req.session.totalPrice,req.session.productDetails)
    try {
        const {fname,lname,phoneNo,email,payment_method,logistics,deliveryDate,address,deliveryTime,reciepientName,note} = req.body
        if(payment_method == 'pesapal'){
            try {
                //let redirectURL=await  processPesaPal(fname,lname,email,phoneNo,totalPrice)
                await sendOrderDb(fname,lname,phoneNo,email,req.session.totalPrice,req.session.productDetails,logistics,deliveryDate,address,deliveryTime,reciepientName,note)
                //mailOrder(email,JSON.stringify(req.body))
                //res.redirect(redirectURL)
            } catch (error) {
                console.log(error)
                res.send(error)
            }
        }
        async function sendOrderDb(fname,lname,phoneNo,email,totalPrice,productDetails,logistics,deliveryDate,address,deliveryTime,reciepientName,note){
            let order ={
                name:`${fname} ${lname}`,
                phoneNo,
                email,
                totalPrice,
                logistics,deliveryDate,address,deliveryTime,reciepientName,note,
                cart:productDetails,
                dispatched:false,
            }
            let response = await orders.insertOne(order)
            console.log(response)
            //req.session.cartItems=[]
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router