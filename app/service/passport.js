const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const mongoose = require('mongoose');

const User = mongoose.model('SocialUser')

// var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var LocalStrategy = require('passport-local').Strategy

/* passport.serializeUser(function(user, done){
   done(null, user.id);
});

passport.deserializeUser(function(id, done){
   User.findById(id, function(err, user){
      done(err, user);
   });
});

passport.use(new GoogleStrategy({
   clientID:"167492841886-15kpote7ilv92t3j4ogho67b56se8ghd.apps.googleusercontent.com",
   clientSecret: "d89ekmLJ15rh7BhvNkaZ5F4-",
   callbackURL: 'http://localhost:8080/auth/google/callback'
 },
 function(accessToken, refreshToken, profile, done) {
      process.nextTick(function(){
         console.log(accessToken, refreshToken, profile, done)
      });
   }

)); */

passport.serializeUser(function(user, done){
   done(null, user.id);
});

passport.deserializeUser(function(id, done){
   User.findById(id, function(err, user){
      done(err, user);
   });
});

passport.use(new GoogleStrategy({
   clientID: "167492841886-15kpote7ilv92t3j4ogho67b56se8ghd.apps.googleusercontent.com",
   clientSecret: "d89ekmLJ15rh7BhvNkaZ5F4-",
   callbackURL: '/auth/google/callback',
   proxy: true
}, async (accessToken, refreshToken, profile, done) => {
   for (let x of profile.emails) {
       var email = x.value
   }
   // console.log(accessToken, refreshToken, profile, done);
   console.log(email);
   console.log(profile.id)
   console.log(profile.name.familyName)
   console.log(profile.name.givenName)
   console.log(refreshToken)
   console.log(accessToken)
   const existingUser = await User.findOne({ userId: profile.id })

   if (existingUser) {
       done(null, existingUser)
   } else {
       let newUser = await new User({
           userId: profile.id,
           firstName: profile.name.givenName,
           lastName: profile.name.familyName,
           email: email,
       })

       newUser.save()
       done(null, user)

   }

})

);