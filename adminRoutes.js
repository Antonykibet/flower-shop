const express = require('express')
const router = express.Router()
const path =require('path')
const multer = require('multer');
const bodyParser = require('body-parser');
const {dbInit,products,accountCollection,subscription, orders, dashboard,ObjectId} = require('./mongoConfig');

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
//router.use('/admin',auth)
router.get('/admin/dashboard', async (req,res)=>{
    const orderdItems = await orders.countDocuments()
    const {visits, cartItems} = await dashboard.findOne({_id:new ObjectId(`652f3ad8c237523c7b489530`)})
    res.render('dashboard.ejs',{siteVisits:visits,carts:cartItems,checkouts:orderdItems})
})
router.get('/admin/subscribedItems',async (req,res)=>{
    let subscribedItems = await subscription.find().toArray()
    res.json(subscribedItems)
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
router.post('/admin/create',upload.fields([{ name: 'mainImage', maxCount: 1 },{ name: 'otherImages', maxCount: 5 }]),async(req,res)=>{
    let {catalogue,name,price,description,topProduct,}=req.body
    console.log(catalogue)
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
    console.log(product)
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



module.exports = router