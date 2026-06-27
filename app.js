if(process.env.NODE_ENV != 'production'){
require('dotenv').config();
}
const mongoose= require('mongoose');
const expressError= require('./expressError.js');

const db_url=process.env.atlasdb_url;
async function connect(){
    await mongoose.connect(db_url);
}
connect().then(console.log("Database connected"))
.catch((err)=>console.log(err));

const express= require('express');
const app= express();
const router= express.Router();
const ejsMate= require('ejs-mate');
const path= require('path');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({extended:true}));
app.set("View engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


const flash= require('connect-flash');
app.use(flash());
const User= require('./Models/user.js');
const plantRouter= require('./routes/plantsRouter.js');
const eventRouter= require('./routes/eventRouter.js');
const userRouter= require('./routes/userRouter.js');

const session= require('express-session');
const {MongoStore} = require('connect-mongo');
const SECRET=process.env.SECRET;
const store= MongoStore.create({
    mongoUrl:db_url,
    crypto:{
        secret:SECRET
    },
    touchAfter:24*3600
});

const sessionOptions={
    store:store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+5*24*60*60*1000,
        maxAge:5*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions));
const cookieParser = require('cookie-parser');
app.use(cookieParser());
var methodOverride= require('method-override');
app.use(methodOverride('_method'));
const localStrategy= require('passport-local');
const passport= require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port= 8080;
app.listen(port, ()=>{
    console.log("Port is listening");
});

app.use((req, res, next)=>{
   res.locals.currUser= req.user ;
    next();
});


app.get("/", (req, res)=>{
    res.render("pages/Home.ejs");
    
});
app.get("/initiatives", (req, res)=>{
    res.render("pages/Initiative.ejs")
});

app.use('/events', eventRouter);
app.use('/plant', plantRouter);

app.get("/about", (req, res)=>{
    res.render("pages/about_us.ejs");
});

app.use('/user', userRouter);

app.use(()=>{
   throw new expressError(404, "Page not found!");
});
app.use((err, req, res, next)=>{
    let {status=500, message="Some error occured"}= err;
    res.status(status).render('pages/error.ejs', {message});
});

