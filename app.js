const express=require('express')
require('dotenv').config()
const app = express()
const  mongoose=require('mongoose')
const connection = require("./db");

const PORT =process.env.PORT || 4000;
connection()
const passport = require('passport');

const expressLayouts = require('express-ejs-layouts');
const indexRoute = require('./routes/index');
const userRoute = require('./routes/user');
const session = require('express-session');
const MongoStore = require('connect-mongo').session;

const morgan = require('morgan');
require('./config/passport').passport;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(morgan('dev'));
// SESSION MIDDLEWARE 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // This should work with HTTPS
    //store: store // Use the store you created
}));
// PASSPORT MIDDLEWARE 
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{
    if(req.isAuthenticated){
        console.log("Now we can set global variable");
        res.locals.user = req.user;
        next();
    }else{
        console.log("Now we can not set global variable");
        res.locals.user = null;
        next();
    }
});











app.use('/', indexRoute);
app.use('/auth', userRoute);


app.listen(PORT, ()=>console.log('server is running on:'+PORT))