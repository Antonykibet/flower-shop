const express = require('express')
const admnRoute = express.Router()
const path =require('path')
const multer = require('multer');
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
function auth(req,res,next){
    //if not authenticated, redirect to login page
    if(req.session.user){
        next()
    }else{
        res.send('intruder')
    }
}
//admnRoute.use('/admin',auth)
admnRoute.get('/admin/dashboard', async (req,res)=>{
    const orderdItems = await orders.countDocuments()
    const {visits, cartItems} = await dashboard.findOne({_id:new ObjectId(`652f3ad8c237523c7b489530`)})
    res.render('dashboard.ejs',{siteVisits:visits,carts:cartItems,checkouts:orderdItems})
})
admnRoute.get('/admin/subscribedItems',async (req,res)=>{
    let subscribedItems = await subscription.find().toArray()
    res.json(subscribedItems)
})
admnRoute.post('/admin/updateDeliverRecords',async(req,res)=>{
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



module.exports = {admnRoute,dbInit}