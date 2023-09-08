const express = require('express')
const {MongoClient, ObjectId} = require('mongodb')
const admnRoute = express.Router()
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

function auth(req,res,next){
    if(req.session.user){
        next()
    }else{
        res.send('intruder')
    }
}
admnRoute.use('/admin',auth)
admnRoute.get('/admin/dashboard',(req,res)=>{
    res.render('dashboard.ejs')
})



module.exports = {admnRoute,dbInit}