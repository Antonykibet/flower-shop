const {MongoClient, ObjectId} = require('mongodb')
const uri = "mongodb+srv://antonykibet059:123Acosta@cluster0.eoos6vz.mongodb.net/?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri)

let db = dbClient.db('flowerShop');
let products = db.collection('flowers')
let accounts =  db.collection('accounts')
let orders = db.collection('Orders')
let dashboard =db.collection('dashboard')


async function dbInit(){
    await dbClient.connect();
}

module.exports = {uri,dbInit,products,accounts,orders,dashboard,ObjectId}