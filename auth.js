require('dotenv').config();
const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')
const {dbInit,accounts,products,orders,dashboard,subscription,ObjectId} = require('./mongoConfig');

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: ['email','profile'],
  }, 
  async function (issuer, profile, cb) {
    console.log(profile,issuer)
    try {
      // Use MongoDB to find the user based on provider and subject (profile.id)
      const user = await accounts.findOne({ provider: issuer, subject: profile.id });
    
      if (!user) {
        console.log('hello')
        // If the user does not exist, create a new user and insert it into MongoDB
        const newUser = {
          name: profile.displayName,
          email: profile.emails[0].value,
          provider: issuer,
          subject: profile.id,
        };
  
        const result = await accounts.insertOne(newUser);
        console.log(result)
        if (result.insertedCount === 1) {
          newUser._id = result.insertedId;
          return cb(null, newUser);
        }
      }
  
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }));

  
  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

router.get('/login/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));


router.post('/login',async (req,res)=>{
    const {email,password} = req.body
    console.log('hello')
    let user
    try{
        user = await accounts.findOne({email:email})
        if(!user){
            res.render('login',{wrongUser:'Wrong Username,',wrongPass:''})
            return
        }

    }catch{
        res.render('login',{wrongUser:'Wrong Username' ,wrongPass:''})    
    }
    if(user.password !== password){
        res.render('login',{wrongUser:'',wrongPass:'Wrong Password'})
        return
    }
    if(email=='antonykibet059@gmail.com' && password=='123@Anto'){
        req.session.isAdmin=true   
    }
    req.session.email=email
    req.session.isUser=true
    res.redirect('/')
})

router.post('/signUp',async(req,res)=>{
    const {firstname,lastname,email,password} = req.body
    if( await accounts.findOne({email:email})){
        res.render('sign',{error:'Email already exists!'})
        return
    }
    let user ={
        name:`${firstname} ${lastname}`,
        email:email,
        password:password,
    }
    await accounts.insertOne(user)
    console.log(`Account creation succesful:${user.name}`)
    res.render('login',{wrongUser:'',wrongPass:''})
})

module.exports=router