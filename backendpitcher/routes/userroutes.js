//importing packages
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const router = express.Router()
const _ = require('lodash');
const User = mongoose.model('user')
const jhelper = require('../configuration/jhelper');
const Pitcher = mongoose.model('pitcher')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const JWT_RESET_KEY = "jwtreset987";
const bcryptjs = require('bcryptjs');
var udata;

//routers

//endpoint logic to signup into the website through local-strategy and sending mail for activation

router.post('/signup', (req, res, next) => {
    console.log("inside post sign-up method");
    const { name, email, password } = req.body;
    let errors = [];


    User.findOne({ email: email }).then(user => {
        if (user) {

            errors.push({ msg: 'Email ID already registered' });
            console.log(errors);

        } else {

            const token = jwt.sign({ name, email, password }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP });
            const CLIENT_URL = 'http://' + req.headers.host;
            const output = `
            <h2>Please click on below link to activate your account</h2>
            <p>${CLIENT_URL}/user/activateuser/${token}</p>
            <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
            `;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "lemonteam.pitcher@gmail.com",
                    pass: "pitcheR@123",
                },
            });

            // send mail with defined transport object
            const mailOptions = {
                from: '"Team_Lemon" <lemonteam.pitcher@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Account Verification: Pitcher Auth ✔", // Subject line
                html: output, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);

                    res.redirect('/user/signup');
                }
                else {
                    console.log('Mail sent : %s', info.response);
                    console.log("success")
                }
            })

        }
    });
})
//endpoint for activating user
router.get('/activateuser/:token', (req, res, next) => {
    const token = req.params.token;
    const mailurl = 'http://' + process.env.FRONTEND_URL;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.log("link expired");
                res.redirect(mailurl + '/signup');
            }
            else {
                const { name, email, password, verified } = decodedToken;
                console.log(decodedToken);
                User.findOne({ email: email }).then(user => {
                    if (user) {


                        console.log('Email ID already registered! Please log in.');

                        res.redirect(mailurl + '/signin');
                    } else {
                        const newUser = new User({
                            name,
                            email,
                            password,
                            verified

                        });

                        bcryptjs.genSalt(10, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.saltSecret = salt;
                                newUser.verified = true;
                                newUser
                                    .save()
                                    .then(user => {
                                        console.log("Account activated");

                                    })


                                    .catch(err => console.log(err));
                            });
                        });
                        res.redirect(mailurl + '/signin');

                    }
                });

            }

        })
    }
    else {
        console.log("Account activation error!")
    }


})
//endpoint for sending reset-link for forgot password
router.post('/forgot', (req, res) => {
    const { email } = req.body;
    const mailurl = 'http://' + process.env.FRONTEND_URL;

    let errors = []
    let response = []

    User.findOne({ email: email }).then(user => {
        if (!user) {

            errors.push({ msg: 'User with Email ID does not exist!' });
            res.send(errors);
        } else {

            const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
            const CLIENT_URL = mailurl;
            const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/reset/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

            User.updateOne({ resetLink: token }, (err, success) => {
                if (err) {
                    errors.push({ msg: 'Error resetting password!' });
                    res.send(errors);
                }
                else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: "lemonteam.pitcher@gmail.com",
                            pass: "pitcheR@123",
                        },
                    });

                    // send mail with defined transport object
                    const mailOptions = {
                        from: '"Team_Lemon" <lemonteam.pitcher@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Account Password Reset: Pitcher Auth ✔", // Subject line
                        html: output, // html body
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {

                            errors.push('Something went wrong on our end. Please try again later.');
                            res.send(errors)
                        }
                        else {
                            console.log('Mail sent : %s', info.response);

                            response.push({ msg: 'Password reset link sent to email ID. Please follow the instructions.' });
                            res.send(response);

                        }
                    })
                }
            })

        }
    });

})


//endpoint to verify the link send for password reset
router.get('/forgot/:token', (req, res, next) => {
    const { token } = req.params;
    const mailurl = 'http://' + process.env.FRONTEND_URL;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {


                console.log('Incorrect or expired link! Please try again.');

                res.redirect(mailurl + '/reset');
            }
            else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) {


                        console.log('User with email ID does not exist! Please try again.');

                        res.redirect(mailurl + '/password');
                    }
                    else {
                        res.send({ id: _id });
                    }
                })
            }
        })
    }
    else {
        console.log("Password reset error!")
    }

})

//endpoint to reset the password
router.post('/reset/:id', (req, res, next) => {
    let responses = []
    var { password, password2 } = req.body;
    const id = req.params.id;
    const mailurl = 'http://' + process.env.FRONTEND_URL;
    if (password != password2) {


        res.send('Passwords do not match.');
    }

    else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(password, salt, (err, hash) => {
                if (err) throw err;
                password = hash;

                User.findByIdAndUpdate(
                    { _id: id },
                    { password },
                    function (err, result) {
                        if (err) {
                            responses.push('Error resetting password!');
                            res.send(responses);
                        } else {
                            responses.push({ msg: "password reset done successfully" })
                            res.send(responses);
                        }
                    }
                );

            });
        });
    }
})

//endpoint logic to get the details of particular user through id

router.get('/getuserbyid/:id', (req, res) => {
    console.log("inside getUser method")
    User.findById(req.params.id, (err, users) => {
        if (err)
            res.send(err)
        else
            res.json(users)
    })
})

//endpoint logic to delete the particular user through id

router.delete('/deleteuser/:id', (req, res, next) => {
    console.log("inside delete user method")
    User.findByIdAndDelete(req.params.id, (err, users) => {
        if (!err)
            res.json(users)
        else
            console.log('Error in users delete: ' + JSON.stringify(err, undefined, 2));
    })
})

//end point logic to update the details of user through the id

router.put('/updateuser/:id', (req, res) => {
    console.log("inside putuser method")
    var user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    User.findByIdAndUpdate(req.params.id, { $set: user }, { new: true }, (err, doc) => {
        if (!err)
            res.send(doc)
        else
            console.log("error in update")
    })
})

//endpoint logic to the login



router.post('/authenticate', (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return res.status(400).json(err)
        else if (user) {
            User.findOne({ email: req.body.email }, (err, users) => {
                if (err)
                    return err;
                else {
                    users.set("accessToken", users.generatedJwt()).save();
                    udata = users

                    return res.status(200).json(udata)
                }
            })
        } else
            return res.status(404).json(info);
    })(req, res);
})



module.exports = router;