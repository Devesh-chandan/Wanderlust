if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
console.log(process.env);
 

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listings = require("./models/listings.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");

const ExpressError=require("./utils/ExpressError.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session=require("express-session");

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

// Use the Atlas URL from .env, or fallback to local for development safety
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

// main()
// .then(()=>{
//     console.log("connected to DB"); 
// })
// .catch(
//     err => console.log(err)
// );

// async function main() {
//   await mongoose.connect(MONGO_URL);
// };

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:"secret",
        
//     },
//     touchAfter:24*3600,


// });









// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret:"secret",
//     },
//     touchAfter: 24 * 3600,
// });

// store.on("error", (err) => {
//     console.log("ERROR IN MONGO SESSION STORE", err);
// });





const sessionOptions={
   
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
};



// app.get("/",(req,res)=>{
//     res.send("server is working");
// });


app.use(session(sessionOptions));




app.use(flash());
app.use(passport.initialize());
  
app.use(passport.session());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUsers=req.user;
    next();

});


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// app.get("/demouser",async (req,res)=>{
//     const fakeUserr=new User({
//         email:"dogesh@gmail.com",
//         username:"dogesh123",
//     });
//     let newUser=await User.register(fakeUserr,"hello world!!");
//     res.send(newUser);
// })


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


// app.get("/testListings", async(req,res)=>{
// let sampleListing =new Listings({
//     title:"first listing",
//     description:"sample default listing",
//     location:"nagpur",
//     price:1000000,
//     country:"india",
// });
// await sampleListing.save();
// console.log("sample was saved");
// res.send("success testing");
// });


app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong!!"}=err;

    res.render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("server is listening");
});


