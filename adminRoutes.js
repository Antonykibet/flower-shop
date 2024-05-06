const express = require('express')
const router = express.Router()
const path =require('path')
const multer = require('multer');
const bodyParser = require('body-parser');
const {dbInit,products,accountCollection,subscription, orders, dashboard,events,ObjectId} = require('./mongoConfig');

const storage = multer.diskStorage(
    {
        destination:function(req,file,cb){
         
        cb(null, path.join(__dirname, '/public/images'));
        },
        filename:function(req,file,cb){
            cb(null,file.originalname)
        }
    }
)
const upload = multer({storage})


router.use(bodyParser.urlencoded({ extended: true }));


function auth(req,res,next){
    let {role} = req.session.user || false
    if(role=='admin'){
        next()
        return
    }else{
        res.send('intruder')
    }
}
router.use('/admin',auth)
router.get('/admin/dashboard', async (req,res)=>{
    const orderdItems = await orders.countDocuments()
    const {visits, cartItems} = await dashboard.findOne({_id:new ObjectId(`652f3ad8c237523c7b489530`)})
    res.render('dashboard.ejs',{siteVisits:visits,carts:cartItems,checkouts:orderdItems})
})
router.get('/admin/subscribedItems',async (req,res)=>{
    let subscribedItems = await subscription.find().toArray()
    res.json(subscribedItems)
})
router.get('/admin/orderdItems/:filter',async(req,res)=>{
    let {filter}=req.params
    if(filter === 'notDispatched'){
        let items = await orders.find({ dispatched: false }).toArray()
        res.json(items)
    }
    if(filter === 'dispatched'){
        let items = await orders.find({ dispatched: true }).toArray()
        res.json(items)
    }
    
    
})
router.post('/admin/updateDeliverRecords',async(req,res)=>{
    const {id,nextDelivery,lastDelivery}=req.body
    console.log(nextDelivery,lastDelivery)
    await subscription.updateOne(
        { _id: new ObjectId(id)},
         { $inc: { deliveries: 1 },
            $set:{
                lastDelivery:lastDelivery,
                nextDelivery:nextDelivery
            }
         })
    res.redirect('back')
})
router.post('/admin/removeEventPhoto',async(req,res)=>{
    const {event} = req.body
    try {
        let response = await events.deleteOne({_id:new ObjectId(event)})
        console.log(response)
        res.redirect('back')
    } catch (error) {
        console.log(`Erorr removing event: ${error}`)
        res.json(error)
    }
})
router.post('/admin/addEventPhoto',upload.single('image'),async(req,res)=>{
    const {caption,eventTitle} = req.body
    if(req.file){
        const image = req.file.originalname
        console.log(image)
        const eventData={
            caption,
            image,
            title:eventTitle
        }
        await events.insertOne(eventData)
    }
    res.redirect('back')
})
router.post('/admin/discount',async(req,res)=>{
    let {discount} = req.body
    discount = parseFloat(discount)
    const discountFactor = 1 - discount / 100;
    try {
        // Fetch all products
        const allProducts = await products.find({}).toArray();

        // Calculate discounted price for each product
        const updatedProducts = allProducts.map(product => {
            const originalPrice = parseFloat(product.price);
            const discountedPrice = originalPrice * discountFactor;

            return {
                ...product,
                isDiscounted: true,
                discountedPrice
            };
        });

        await products.bulkWrite(updatedProducts.map(product => ({
            updateMany: {
                filter: { top: true},
                update: { $set: { discountedPrice: product.discountedPrice,isDiscounted: true } }
            }
        })));
    
       //console.log(`${updateResult.modifiedCount} products were successfully discounted.`);
        res.status(200).redirect('back')
    } catch (error) {
        console.error("Error setting discount:", error);
        res.status(400).send('Discount set failed')
    }
})

router.post('/admin/create',upload.fields([{ name: 'mainImage', maxCount: 1 },{ name: 'otherImages', maxCount: 5 }]),async(req,res)=>{
    let {catalogue,name,price,description,topProduct,}=req.body
    let mainFile = req.files.mainImage ? req.files.mainImage[0].filename : null
    let otherImages = req.files.otherImages ? req.files.otherImages.map(file=>file.filename) : null
    let product ={
        catalogue,
        name,
        price,
        description,
        top:Boolean(topProduct),
        image: mainFile,
        images:otherImages,
        unit:1,
    }
    await products.insertOne(product)
    res.redirect('back')
})
router.post('/admin/update',upload.fields([{ name: 'mainImage', maxCount: 1 },{ name: 'otherImages', maxCount: 5 }]),async(req,res)=>{
    //console.log(JSON.parse(JSON.stringify(req.body)))
    let update = JSON.parse(JSON.stringify(req.body))
    const id = update.prodId
    let {prodId,...filteredUpdate} =update
    await products.updateOne({_id:new ObjectId(id)},{$set:filteredUpdate})
    res.redirect('back')
})
router.post('/admin/delete',async(req,res)=>{
    let {prodId} = JSON.parse(JSON.stringify(req.body))
    await products.deleteOne({_id:new ObjectId(prodId)})
    res.redirect('back')
})
router.post('/admin/dispatched',async(req,res)=>{
    const {_id} = req.body
    const response = await orders.updateOne({_id: new ObjectId(_id)},{$set:{dispatched:true}})
    res.json(response)
})



module.exports = router