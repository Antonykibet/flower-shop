const express = require('express')
const admnRoute = express.Router()
const path =require('path')
const multer = require('multer');
const {dbInit,products,accountCollection, orders, dashboard,ObjectId} = require('./mongoConfig');

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



module.exports = {admnRoute,dbInit}