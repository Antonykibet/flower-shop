const { urlencoded } = require('body-parser')
const express = require('express')
const {readFile} = require('fs')
const { get } = require('http')
const {routes,dbClient, dbInit} = require('./routes.js')
const {admnRoute} = require('./adminRoutes.js')
const sessions = require('express-session')
const app = express()
const PORT=3500

app.use(sessions({
        secret:'sayMyName',
        resave:false,
        saveUninitialized:false,
        cookie:{
            secure:false,//set to true in production
            maxAge:1000*60*60*24,
        }
    }
))

app.use(express.static('./public'))
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(routes)
app.use(admnRoute)



app.listen(PORT,async()=>{
    await dbInit()
    console.log(`db connected...`)
    console.log(`Server listening at Port ${PORT}...`)
})