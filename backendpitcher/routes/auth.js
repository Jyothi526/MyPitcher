//importing the local packages
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()
const mailurl = 'http://' + process.env.FRONTEND_URL;
router.get('/google', passport.authenticate('google', { authType: 'rerequest', scope: ['email', 'profile'] }),
    (req, res) => {
        console.log("login req:", req)
    })



router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    //res.send(req.user);
    console.log('Callback function recieved user  ')//,req.user)
    //console.log(req.user)
    var responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
    responseHTML = responseHTML.replace('%value%', JSON.stringify({
        user: req.user
    }));

    res.status(200).send(responseHTML);

    //Here the result is sent to the angular service

});



router.get('/logout', (req, res) => {
    console.log("Passport log out called: ")
    req.logout();
    res.json({ "status": true, "message": "Sucessfully logged out" });
});


module.exports = router;