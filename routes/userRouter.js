const express= require('express');
const router= express.Router();
const app= express();
const User= require('../Models/user.js');
const passport= require('passport');

router.get('/login', (req, res)=>{
    res.render('pages/login.ejs', {success: req.flash('success'), error: req.flash('error') });
} );
router.post('/login', 
   passport.authenticate("local", {
    failureRedirect: "/user/login", 
    failureFlash:true,
}), 
    (req, res)=>{
    res.redirect('/');
});
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports= router;
