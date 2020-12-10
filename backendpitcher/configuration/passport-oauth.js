//importing the packages

const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('user')
//const jhelper = require('../configuration/jhelper');
const refresh = require("passport-oauth2-refresh");
//const { authenticate } = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;



//serializing the user
passport.serializeUser(function (user, cb) {
  cb(null, user.id)
}),

  //deserializing the user
  passport.deserializeUser(function (id, cb) {
    User.findById(id,
      (err, user) => cb(err, user))
  })

//using passport implementation for google signin using google strategy

var strategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3500/auth/google/callback"
},
  (accessToken, refreshToken, profile, cb) => {
    console.log("request from google")
    console.log(profile)
    console.log(accessToken)
    console.log(refreshToken)
    //storing the following details in database in user schema
    const newUser = {
      name: profile.displayName,
      email: profile.emails[0].value,
      // password:profile.name.givenName,
      accessToken: accessToken,
      googleid: profile.id,
      verified: profile.emails[0].verified
    }
    //checking if the user already exists or not,if exists not creating else creating newuser
    User.findOne({ email: profile.emails[0].value }, (err, user) => {
      if (err)
        return err
      else if (user && user['googleid'] != "") {
        console.log("Existing user found, new access token:", accessToken)
        user.set("accessToken", accessToken).save()
        return cb(null, user)
      }
      else if (user && !user['googleid']) {
        return cb(null, false, { message: 'Email is already registered, please try different sign in method' });
      }
      else {
        user = User.create(newUser)
        return cb(null, user)
      }
    });
  }
);
passport.use(strategy);
refresh.use(strategy);

