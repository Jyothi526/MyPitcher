//importing local files

require('./configuration/conn')
require('./models/databaseConnectivity')
require('./configuration/passportconfiguration')
require('./configuration/passport-oauth')
const user = require('./routes/userroutes')
const auth = require('./routes/auth')
const pitch = require('./routes/pitch')

//importing packages

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session')
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const exhbs = require('express-handlebars');
const MongoStore = require('connect-mongo')(session)
var app = express()
//middle ware
const corsOptions = {
    origin: [
        'http://localhost:4200'
    ],
    optionSuccessStatus: 200,
};



//Since, we need to send data in json format,we are making use of it
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session({
    secret: 'flyweight',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

//since our angular app and node js app will be running at two different ports
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('uploads'));
//transferring request to the suitable route

app.use('/auth', auth);
app.use('/user', user);
app.use('/pitch', pitch)


//since our angular app and node js app will be running at two different ports


//stating the server
app.listen(process.env.PORT, () => console.log(`server is running at : ${process.env.PORT}`));