require('dotenv').config();
const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')
const {accounts,} = require('./mongoConfig');
const {resetPassword} = require('./mailer')
const bcrypt = require('bcrypt')
const crypto = require('crypto');
const saltRounds = 10;

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
    let user
    try{
        user = await accounts.findOne({email:email})
        if(!user){
            res.render('login',{wrongUser:'Wrong Username,',wrongPass:''})
            return
        }
        if(!await bcrypt.compare(password, user.password)){
          res.render('login',{wrongUser:'',wrongPass:'Wrong Password'})
          return
        }
        req.session.user = {role:user.role} 

    }catch{
        res.render('login',{wrongUser:'Wrong Username' ,wrongPass:''})    
    }
    let url = req.session.productUrl || '/'
    res.redirect(url)
})

router.post('/signUp',async(req,res)=>{
    const {firstname,lastname,email,password} = req.body
    if( await accounts.findOne({email:email})){
        res.render('sign',{error:'Email already exists!'})
        return
    }
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      let user ={
          name:`${firstname} ${lastname}`,
          email:email,
          password:hashedPassword,
          role:'user',
      }
      await accounts.insertOne(user)
  } catch(err) {
      res.status(500).send(`Sign in error ${err}`);
  }
  res.render('login',{wrongUser:'',wrongPass:''})
})
router.post('/forgotPassword',async(req,res)=>{
  let {email} = req.body
  const resetToken = crypto.randomBytes(20).toString('hex');
  const hashedToken = await bcrypt.hash(resetToken, 10);
  try {
      let result = await accounts.updateOne({email},{$set:{
          resetPasswordToken : hashedToken,
          resetPasswordExpires : Date.now() + 3600000, // 1 hour
      }})
      if(result.matchedCount == 0){
        res.json('Email non-existient')
        return
      }
      console.log(result)
      console.log(result + `stored hashed token`)
      resetPassword(resetToken,email)
      res.json('Check your email!')    
  } catch (error) {
      console.log(error)
  }
})
router.get('/reset-password/:token',(req,res)=>{
  let token = req.params.token
  res.render('resetPassword',{tokenplaceholder:token})
})
router.post('/reset-password/:token', async (req, res) => {
  console.log('Woyo')
  const user = await accounts.findOne({email:req.body.email});
  const tokenMatches = await bcrypt.compare(req.params.token, user.resetPasswordToken);
  //remember to change URL
  console.log(tokenMatches)
  if (!tokenMatches || Date.now() > user.resetPasswordExpires) {
      res.status(400).send('Password reset token is invalid or has expired.');
      return;
  }

  // Update Password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
      await accounts.updateOne({email:req.body.email},{$set:{
          password:hashedPassword,
          resetPasswordToken : undefined,
          resetPasswordExpires : undefined,
      }})   
      res.send('Password update succesfull')
  } catch (error) {
      console.log(error)
  }
});
module.exports=router