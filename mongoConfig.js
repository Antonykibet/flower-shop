require('dotenv').config();
const {MongoClient, ObjectId} = require('mongodb')
const uri = process.env.MONGO_URL;
const dbClient = new MongoClient(uri)

let db = dbClient.db('flowerShop');
let products = db.collection('flowers')
let accounts =  db.collection('accounts')
let orders = db.collection('Orders')
let dashboard =db.collection('dashboard')
let subscription = db.collection('subscription')


async function dbInit(){
    await dbClient.connect();
}

module.exports = {uri,dbInit,products,accounts,orders,dashboard,subscription,ObjectId}