if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ─── Database Connection ─────────────────────────────────────────────────────
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL || MONGO_URL;

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

// ─── App Configuration ────────────────────────────────────────────────────────
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ─── Session Store (MongoStore for production-ready persistence) ──────────────
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600, // Only update session every 24h unless data changes
});

store.on("error", (err) => {
    console.error("❌ MongoStore session error:", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET || "wanderlust_super_secret_session_key_2025_prod_secure_12345",
    resave: false,
    saveUninitialized: false, // Don't save empty sessions
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // secure: true, // Uncomment in production with HTTPS
    },
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(session(sessionOptions));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Make flash messages and current user available to all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUsers = req.user;
    next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
});
app.get("/terms", (req, res) => {
    res.render("terms.ejs");
});
app.get("/security", (req, res) => {
    res.render("security.ejs");
});
app.get("/cancellation", (req, res) => {
    res.render("cancellation.ejs");
});
app.get("/host-guidelines", (req, res) => {
    res.render("host-guidelines.ejs");
});
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
