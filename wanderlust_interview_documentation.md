# 🌍 Wanderlust — Complete Interview Preparation Guide

> **Project Name:** Wanderlust  
> **Stack:** Node.js · Express.js · MongoDB (Mongoose) · EJS · Passport.js · Cloudinary · Leaflet.js  
> **Architecture Pattern:** MVC (Model-View-Controller)  
> **Purpose:** A full-stack Airbnb-like travel listing web application where users can create, browse, edit, and review property listings.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Deep Dive](#2-tech-stack-deep-dive)
3. [Architecture & Folder Structure](#3-architecture--folder-structure)
4. [Data Models (Mongoose Schemas)](#4-data-models-mongoose-schemas)
5. [Routes & API Design (RESTful)](#5-routes--api-design-restful)
6. [Controllers — Business Logic](#6-controllers--business-logic)
7. [Middleware — The Guardian Layer](#7-middleware--the-guardian-layer)
8. [Authentication & Authorization (Passport.js)](#8-authentication--authorization-passportjs)
9. [File Uploads — Cloudinary + Multer](#9-file-uploads--cloudinary--multer)
10. [Geocoding — Nominatim + Leaflet.js](#10-geocoding--nominatim--leafletjs)
11. [Session & Flash Messages](#11-session--flash-messages)
12. [Error Handling Strategy](#12-error-handling-strategy)
13. [Validation — Joi Schema Validation](#13-validation--joi-schema-validation)
14. [Views — EJS Templating + ejs-mate](#14-views--ejs-templating--ejs-mate)
15. [Database Seeding (Init Scripts)](#15-database-seeding-init-scripts)
16. [Environment Configuration](#16-environment-configuration)
17. [Data Flow — End-to-End Request Lifecycle](#17-data-flow--end-to-end-request-lifecycle)
18. [Key Design Decisions & Patterns](#18-key-design-decisions--patterns)
19. [Interview Questions & Answers](#19-interview-questions--answers)

---

## 1. Project Overview

**Wanderlust** is a full-stack web application modeled after Airbnb. It allows:

- 🏠 **Hosts** to create, edit, and delete property listings with images and location
- 🗺️ **Guests** to browse listings that display on an interactive map
- ⭐ **Logged-in users** to post star ratings and comments as reviews
- 🔐 **Authentication** so only listing owners can edit/delete their own listings
- ☁️ **Cloud storage** via Cloudinary for listing images
- 📍 **Geocoding** to convert an address string into GPS coordinates for the map

---

## 2. Tech Stack Deep Dive

| Layer | Technology | Why Used |
|---|---|---|
| **Runtime** | Node.js | Non-blocking, event-driven I/O; perfect for web servers |
| **Web Framework** | Express.js v5 | Minimal, flexible routing and middleware support |
| **Database** | MongoDB (Atlas / Local) | Schema-flexible NoSQL; great for document-based listing data |
| **ODM** | Mongoose 9 | Schema + validation + middleware + population for MongoDB |
| **Template Engine** | EJS + ejs-mate | Server-side rendering; ejs-mate adds layout support |
| **Authentication** | Passport.js + passport-local-mongoose | Sessions-based auth with Local Strategy |
| **Session Store** | express-session | Manages server-side sessions |
| **Flash Messages** | connect-flash | One-time messages across redirects |
| **File Upload** | Multer + multer-storage-cloudinary | Handles multipart files; pipes to Cloudinary |
| **Cloud Storage** | Cloudinary | Image hosting, transformations, CDN delivery |
| **Geocoding** | OpenStreetMap Nominatim API | Free geocoding to convert address to [lon, lat] |
| **Maps** | Leaflet.js | Open-source interactive maps in the browser |
| **Validation** | Joi | Schema-based input validation on the server |
| **HTTP Method Override** | method-override | Enables PUT/DELETE from HTML forms |
| **CSS Framework** | Bootstrap 5 | Responsive grid, UI components |
| **Icons** | Font Awesome 7 | SVG icon pack |
| **Environment** | dotenv | Loads .env variables into `process.env` |

---

## 3. Architecture & Folder Structure

```
MAJOR-PROJECT1/
├── app.js                  ← Entry point: sets up Express, DB, middleware, routes
├── cloudConfig.js          ← Cloudinary + Multer storage configuration
├── middleware.js           ← Custom middleware (auth guards, validation)
├── schema.js               ← Joi validation schemas (listing + review)
├── .env                    ← Secret environment variables (never committed)
├── package.json            ← Project metadata and dependencies
│
├── models/                 ← Mongoose Data Models (M in MVC)
│   ├── listings.js         ← Listing schema with cascade delete, geospatial index
│   ├── review.js           ← Review schema (rating, comment, author ref)
│   └── user.js             ← User schema with passport-local-mongoose plugin
│
├── routes/                 ← Express Router instances (URL → Controller mapping)
│   ├── listing.js          ← /listings routes  (CRUD)
│   ├── reviews.js          ← /listings/:id/reviews routes
│   └── user.js             ← /signup, /login, /logout routes
│
├── controllers/            ← Business Logic (C in MVC)
│   ├── listings.js         ← index, show, create, update, delete listing
│   ├── review.js           ← create + delete review
│   └── user.js             ← signup, login, logout handlers
│
├── utils/                  ← Reusable utility helpers
│   ├── ExpressError.js     ← Custom Error class (statusCode + message)
│   ├── wrapAsync.js        ← HOF to catch async errors and pass to next()
│   └── geocode.js          ← Calls Nominatim API, returns [lon, lat]
│
├── views/                  ← EJS Templates (V in MVC)
│   ├── layouts/
│   │   └── boilerplate.ejs ← Base HTML layout (HTML shell)
│   ├── includes/
│   │   ├── navbar.ejs      ← Responsive navigation bar (auth-aware)
│   │   ├── footer.ejs      ← Site footer
│   │   └── flash.ejs       ← Flash message display
│   ├── listings/
│   │   ├── index.ejs       ← Browse all listings with filter bar
│   │   ├── show.ejs        ← Single listing detail + map + reviews
│   │   ├── new.ejs         ← New listing form
│   │   └── edit.ejs        ← Edit listing form
│   ├── users/
│   │   ├── signup.ejs      ← Registration form
│   │   └── login.ejs       ← Login form
│   └── error.ejs           ← Generic error display page
│
├── public/                 ← Static assets served directly
│   ├── css/style.css       ← Custom global CSS
│   └── js/
│       ├── script.js       ← Client-side JS (Bootstrap form validation)
│       └── map.js          ← Leaflet.js map initialization
│
└── init/                   ← Database seeding scripts
    ├── data.js             ← Array of 50 sample listing objects
    └── index.js            ← Seeds the DB (deleteMany + insertMany)
```

### MVC Separation at a Glance

```
Browser Request
      │
      ▼
  routes/*.js  ──────►  middleware.js (auth guards, validation)
      │                         │
      ▼                         ▼
controllers/*.js  ◄─────────────┘
      │    │
      │    └──► models/*.js  ◄──► MongoDB
      │
      └──► views/*.ejs  ──────► HTML Response to Browser
```

---

## 4. Data Models (Mongoose Schemas)

### 4.1 Listing Model (`models/listings.js`)

```js
const listingSchema = new Schema({
  title:       { type: String, required: true },
  description: String,
  image:       { url: String, filename: String },   // Cloudinary
  location:    String,
  geometry: {                                        // GeoJSON for map
    type:        { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  price:   Number,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],  // virtual join
  owner:   { type: Schema.Types.ObjectId, ref: "User" }       // virtual join
});

// Geospatial index for location-based queries
listingSchema.index({ geometry: "2dsphere" });

// Cascade delete: when a listing is deleted, all its reviews are deleted too
listingSchema.post("findByIdAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
```

**Key Points:**
- `image` stores `{ url, filename }` — url for display, filename for Cloudinary management
- `geometry` is a GeoJSON Point — required by Leaflet and MongoDB `2dsphere` index
- `reviews` is an array of ObjectId references — a **one-to-many** relationship
- The `post("findByIdAndDelete")` hook solves the **orphan data problem**

---

### 4.2 Review Model (`models/review.js`)

```js
const reviewSchema = new Schema({
  comment:   String,
  rating:    { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now() },
  author:    { type: Schema.Types.ObjectId, ref: "User" }
});
```

**Key Points:**
- `author` ref enables nested `.populate()` — fetches username when rendering reviews
- Rating is bounded between 1–5 at the Mongoose level (Joi layer validates too)

---

### 4.3 User Model (`models/user.js`)

```js
const userSchema = new Schema({
  email: { type: String, required: true }
});

userSchema.plugin(passportLocalMongoose);
// adds: username, hash, salt, register(), authenticate(), serialize/deserialize
```

**Key Points:**
- `passport-local-mongoose` plugin automatically adds `username`, password hash+salt, `User.register()`, `User.authenticate()`
- Never stores plain-text passwords — uses PBKDF2 hashing under the hood

---

## 5. Routes & API Design (RESTful)

The project follows **REST conventions** closely:

| Method | URL | Middleware | Action |
|--------|-----|-----------|--------|
| GET | `/listings` | — | Index — Show all listings |
| POST | `/listings` | isLoggedIn, upload, validatelisting | Create — Add a new listing |
| GET | `/listings/new` | isLoggedIn | Render new listing form |
| GET | `/listings/:id` | — | Show — View single listing |
| PUT | `/listings/:id` | isLoggedIn, isOwner, upload, validatelisting | Update listing |
| DELETE | `/listings/:id` | isLoggedIn, isOwner | Delete listing |
| GET | `/listings/:id/edit` | isLoggedIn, isOwner | Render edit form |
| POST | `/listings/:id/reviews` | isLoggedIn, validateReview | Create a review |
| DELETE | `/listings/:id/reviews/:reviewId` | isLoggedIn, isReviewAuthor | Delete a review |
| GET | `/signup` | — | Render signup form |
| POST | `/signup` | — | Register new user |
| GET | `/login` | — | Render login form |
| POST | `/login` | saveRedirectUrl, passport.authenticate | Authenticate user |
| GET | `/logout` | — | Destroy session |

> **HTML forms only support GET and POST.** `method-override` middleware reads `?_method=PUT` or `?_method=DELETE` from form actions and converts the request method accordingly.

### Route Chaining Pattern

```js
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("listing[image]"), validatelisting, wrapAsync(listingController.createListing));

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validatelisting, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
```

### Nested Routes & `mergeParams`

```js
// app.js
app.use("/listings/:id/reviews", reviewsRouter);

// routes/reviews.js
const router = express.Router({ mergeParams: true }); // gives access to :id from parent
```

---

## 6. Controllers — Business Logic

### 6.1 `showListing` — Nested Populate

```js
const listing = await Listings.findById(id)
  .populate({ path: "reviews", populate: { path: "author" } })
  .populate("owner");
```

This is a **nested populate** — fetches review documents AND within each review fetches the author's user document.

### 6.2 `createListing` — Full Pipeline

```js
const coords = await geocode(req.body.listing.location);
newlisting.geometry = { type: "Point", coordinates: coords };
newlisting.image = { url: req.file.path, filename: req.file.filename };
newlisting.owner = req.user._id;
await newlisting.save();
```

### 6.3 `updateListing` — Conditional Image Update

```js
// Only replaces image if a new file was actually uploaded
if (typeof req.file !== "undefined") {
  listing.image = { url: req.file.path, filename: req.file.filename };
}
```

### 6.4 `deleteReview` — Two-step cleanup

```js
// Remove review ID from listing's array atomically
await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
// Delete the review document itself
await Review.findByIdAndDelete(reviewId);
```

### 6.5 `signUpuser` — Auto-login after registration

```js
const registeredUser = await User.register(newUser, password);
req.login(registeredUser, (err) => {   // Passport's req.login()
  req.flash("success", "welcome to wanderlust!!");
  res.redirect("/listings");
});
```

### 6.6 `loginUser` — Smart Redirect

```js
let redirectUrl = res.locals.redirectUrl || "/listings";
res.redirect(redirectUrl);
```

---

## 7. Middleware — The Guardian Layer

### `isLoggedIn` — Route Protection

```js
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;  // Save intended URL
    req.flash("error", "you must be logged in first!!");
    return res.redirect("/login");
  }
  next();
};
```

### `saveRedirectUrl` — Preserve Redirect After Login POST

```js
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
```

> Passport's `authenticate()` regenerates the session, so this middleware copies `redirectUrl` to `res.locals` BEFORE authentication runs.

### `isOwner` — Listing Authorization

```js
module.exports.isOwner = async (req, res, next) => {
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUsers._id)) {  // .equals() for ObjectId comparison
    req.flash("error", "you don't have authority to update");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
```

### `validatelisting` / `validateReview`

```js
module.exports.validatelisting = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
```

---

## 8. Authentication & Authorization (Passport.js)

### Setup

```js
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

### Session-Based Auth Flow

```
1. User logs in → POST /login
2. passport.authenticate("local") runs:
   a. Finds user by username in MongoDB
   b. Verifies password (PBKDF2 comparison via passport-local-mongoose)
   c. If valid → serializeUser → stores user._id in session
3. Session cookie sent to browser
4. On subsequent requests → deserializeUser → queries DB by user._id → req.user attached
5. req.isAuthenticated() checks if req.user exists
```

### Global `currUsers` Variable

```js
app.use((req, res, next) => {
  res.locals.currUsers = req.user;  // Available in ALL EJS templates automatically
  next();
});
```

---

## 9. File Uploads — Cloudinary + Multer

### Flow

```
Form POST (multipart/form-data)
        │
        ▼
   Multer middleware
        │  intercepts the file stream
        ▼
   multer-storage-cloudinary
        │  uploads directly to Cloudinary cloud
        ▼
   req.file = { path: "https://res.cloudinary.com/...", filename: "Wanderlust_DEV/xyz" }
        │
        ▼
   Controller saves url & filename to MongoDB
```

> **`req.file.path`** contains the full Cloudinary URL (NOT a local disk path!).

---

## 10. Geocoding — Nominatim + Leaflet.js

### `utils/geocode.js`

```js
async function geocode(address) {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}`;
  const response = await fetch(url, { headers: { "User-Agent": "Major-Project1/1.0" } });
  const data = await response.json();
  const { lon, lat } = data[0];
  return [parseFloat(lon), parseFloat(lat)];  // GeoJSON format: [longitude, latitude]
}
```

> **Critical:** GeoJSON stores coordinates as **[longitude, latitude]** — opposite of GPS [lat, lon]. MongoDB `2dsphere` index expects GeoJSON format.

### Map Rendering in `show.ejs`

```html
<div id="map"
  data-lat="<%= listing.geometry.coordinates[1] %>"
  data-lng="<%= listing.geometry.coordinates[0] %>"
  style="height: 350px;">
</div>
```

`map.js` reads these data attributes and initializes Leaflet with `L.map("map").setView([lat, lng], 12)`.

---

## 11. Session & Flash Messages

### Session Configuration

```js
const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly: true   // Prevents XSS from accessing cookie via JavaScript
  }
};
```

### Flash Pattern

```js
// Controller: set flash
req.flash("success", "new listing successfully created!!");
req.flash("error",   "you must be logged in first!!");

// app.js: make available in all views
res.locals.success = req.flash("success");
res.locals.error   = req.flash("error");

// flash.ejs: render conditionally
<% if(success && success.length) { %>
  <div class="alert alert-success"><%= success %></div>
<% } %>
```

Flash messages are **one-time** — read once and cleared from session. They survive a redirect.

---

## 12. Error Handling Strategy

### wrapAsync — Async Error Catching (Higher Order Function)

```js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);  // Any rejected promise → next(err)
  };
};
```

### Custom Error Class

```js
class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
```

### Global Error Handler (4-argument = error handler in Express)

```js
// 404 for unmatched routes
app.use((req, res, next) => {
  next(new ExpressError(404, "page not found!"));
});

// Catch-all error renderer
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!!" } = err;
  res.render("error.ejs", { err });
});
```

### Error Flow

```
async controller throws/rejects
        │
   wrapAsync.catch(next)
        │
   next(err) called
        │
   Global Error Handler
        │
   res.render("error.ejs")
```

---

## 13. Validation — Joi Schema Validation

```js
// schema.js
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().required(),
    location:    Joi.string().required(),
    country:     Joi.string().required(),
    price:       Joi.number().required().min(0),
    image:       Joi.string().allow("", null),
  }).required()
});
```

**Two layers of validation:**
1. **Client-side:** Bootstrap `.needs-validation`, HTML `required` attributes
2. **Server-side:** Joi schemas in middleware (authoritative; cannot be bypassed)

The body is structured as `req.body.listing.title` because forms use `name="listing[title]"` — Express body-parser converts this to nested objects.

---

## 14. Views — EJS Templating + ejs-mate

### Layout System

```js
app.engine("ejs", ejsMate);  // Replace default EJS engine with ejs-mate
```

Every view starts with:
```ejs
<% layout("/layouts/boilerplate") %>
```

`boilerplate.ejs` defines the full HTML shell. `<%- body %>` is where the child view content is injected.

### Conditional Navbar

```ejs
<% if(currUsers == undefined) { %>
  <a href="/signup">SignUp</a>
  <a href="/login">Login</a>
<% } %>
<% if(currUsers != undefined) { %>
  <a href="/logout">LogOut</a>
<% } %>
```

### Owner-Only Actions

```ejs
<% if(currUsers && listing.owner._id.equals(currUsers._id)) { %>
  <a href="/listings/<%= listing._id %>/edit">Edit listing</a>
  <form method="POST" action="/listings/<%= listing._id %>?_method=DELETE">
    <button>Delete</button>
  </form>
<% } %>
```

---

## 15. Database Seeding (Init Scripts)

`init/index.js`:
```js
const initDB = async () => {
  await Listing.deleteMany({});  // Wipe existing data
  initData.data = initData.data.map(obj => ({
    ...obj,
    owner: "696792fbd33f178f7dea3fd9"  // Hardcoded owner ID for demo data
  }));
  await Listing.insertMany(initData.data);
};
```

**Purpose:** Quickly populate a fresh database with sample listings for development.

---

## 16. Environment Configuration

```env
ATLASDB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust
SECRET=your_super_secret_session_key
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
```

```js
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();  // Only in development
}

const dbUrl = process.env.ATLASDB_URL || MONGO_URL;  // Fallback to local
```

---

## 17. Data Flow — End-to-End Request Lifecycle

### Creating a New Listing

```
1. GET /listings/new
   → isLoggedIn guard checks session
   → renderNewForm → res.render("listings/new.ejs")

2. POST /listings (multipart/form-data)
   → isLoggedIn guard ✔
   → Multer intercepts file → uploads to Cloudinary
   → req.file = { path: cloudinaryUrl, filename: "..." }
   → validatelisting → Joi validates req.body.listing
   → createListing:
       a. new Listings(req.body.listing)
       b. geocode(location) → [lon, lat]
       c. newlisting.geometry = { type: "Point", coordinates }
       d. newlisting.image = { url, filename }
       e. newlisting.owner = req.user._id
       f. await newlisting.save() → MongoDB
       g. req.flash("success", "created!")
       h. res.redirect("/listings")

3. GET /listings (after redirect)
   → flash message read → cleared from session
   → index.ejs renders with success alert visible
```

---

## 18. Key Design Decisions & Patterns

| Decision | Why |
|----------|-----|
| **MVC separation** | Single responsibility; controllers, routes, views each have one job |
| **wrapAsync HOF** | Avoids writing `.catch(next)` on every async route; DRY principle |
| **Custom ExpressError** | Unified error object with statusCode + message |
| **Cascade delete via post-hook** | Data consistency; no orphaned reviews |
| **`$pull` for review delete** | Atomic array element removal without loading full document |
| **Nested populate** | Fetches reviews AND their authors in one Mongoose query chain |
| **`mergeParams: true`** | Gives nested review router access to `:id` from parent routes |
| **`saveRedirectUrl` middleware** | Solves redirect loss when Passport regenerates session |
| **`2dsphere` index** | Enables efficient geospatial MongoDB queries |
| **`httpOnly: true` on cookie** | XSS defense — JS cannot steal the session cookie |
| **Server-side Joi validation** | Defense-in-depth; client validation can always be bypassed |
| **Cloudinary for images** | CDN delivery, no server disk consumption, persistent |
| **dotenv only in non-production** | In production, env vars come from platform dashboard |

---

## 19. Interview Questions & Answers

---

### JavaScript & Node.js

**Q1: What is the event loop in Node.js and why does it matter for this project?**

Node.js is single-threaded but handles concurrency via the event loop. When an async operation like a MongoDB query fires, Node.js offloads it to libuv (C++ layer), frees the thread for other requests, and resumes when the result is ready. This is why `async/await` is used throughout — operations like `await Listings.find({})` don't block the server from handling other requests simultaneously.

---

**Q2: What is a Higher Order Function? Where is it used in this project?**

A function that takes another function as an argument or returns a function. `wrapAsync` in `utils/wrapAsync.js` is a HOF — it takes an async route handler function, wraps it, and returns a new function that calls `.catch(next)`. This cleanly separates error-forwarding concern from business logic without repeating it everywhere.

---

**Q3: Explain `Object.assign()` usage in `updateListing`.**

`Object.assign(target, source)` copies all enumerable properties from `source` onto `target`. In `updateListing`, it merges the incoming form data into the existing Mongoose document in-place, updating only the fields that were submitted, avoiding manually setting each field.

---

**Q4: Explain closure with an example from the project.**

In `wrapAsync`, the returned function `(req, res, next) => fn(req, res, next).catch(next)` is a closure — it closes over `fn` (the async controller passed in). The inner function "remembers" `fn` even after `wrapAsync` has returned.

---

**Q5: What is the difference between `==` and `===`?**

`==` performs type coercion before comparison. `===` checks both value AND type (strict). In production JavaScript, `===` is almost always preferred to avoid unexpected coercion bugs. Note: for Mongoose ObjectIds, neither works — use `.equals()` instead.

---

### Express.js

**Q6: What are the different types of middleware in Express?**

1. **Application-level:** `app.use()` — runs on every request (flash, session, passport)
2. **Router-level:** `router.use()` — runs on specific route prefixes
3. **Error-handling:** 4-argument `(err, req, res, next)` — only invoked when `next(err)` is called
4. **Built-in:** `express.urlencoded()`, `express.static()`
5. **Third-party:** `passport.initialize()`, `session()`, `multer()`

---

**Q7: What is the difference between `app.use()` and `app.get()`?**

`app.get()` matches only `GET` requests to a specific path. `app.use()` matches ALL HTTP methods and any path **starting with** the given prefix. `app.use("/listings", listingsRouter)` mounts the entire listing router under `/listings`.

---

**Q8: Why is `method-override` needed?**

HTML forms only support `GET` and `POST`. To use `PUT` and `DELETE` (required for REST), the form sends `POST` with `?_method=PUT` or `?_method=DELETE`. The `method-override` middleware intercepts this and replaces `req.method` with the correct HTTP verb before routing.

---

**Q9: How does Express know which function is an error handler?**

By the function signature: `(err, req, res, next)` — four arguments. Regular middleware has three. Express checks the arity (argument count) of the function to determine its type.

---

**Q10: What is `res.locals` and how is it used here?**

`res.locals` is an object scoped to the current request-response cycle. Properties set on it are automatically available in all EJS templates for that request. The global middleware in `app.js` sets `res.locals.currUsers = req.user`, making it accessible in every view without passing it explicitly to each `res.render()` call.

---

**Q11: What is `req.originalUrl` and why is it saved in `isLoggedIn`?**

`req.originalUrl` is the full URL the user was trying to access (e.g., `/listings/new`). It's saved to `req.session.redirectUrl` before redirecting to login, so after successful authentication, the user can be sent back to where they intended to go — not just `/listings`.

---

### MongoDB & Mongoose

**Q12: What is the difference between SQL and MongoDB?**

SQL uses rigid, predefined schemas with tables and foreign key relationships. MongoDB stores flexible JSON-like documents in collections. It scales horizontally and suits data that varies in structure. Mongoose adds schema enforcement on top of MongoDB when needed.

---

**Q13: Explain Mongoose's `.populate()`. What does nested populate do?**

`.populate()` replaces an ObjectId reference with the actual document from the referenced collection (similar to a JOIN in SQL). In the project, `.populate({ path: "reviews", populate: { path: "author" } })` performs two levels: first replaces review ObjectIds with Review documents, then within each Review, replaces `author` ObjectId with the User document.

---

**Q14: What is a Mongoose post-hook and why is cascade delete used here?**

Mongoose middleware hooks (`pre`, `post`) run before or after specific operations. The `listingSchema.post("findByIdAndDelete", ...)` hook fires after a listing is deleted and deletes all reviews that belonged to it, preventing orphaned documents in the database.

---

**Q15: Why use `.equals()` to compare ObjectIds instead of `===`?**

Mongoose ObjectIds are objects, not primitives. `===` compares object references (memory addresses), which will always be false for two different ObjectId objects representing the same ID. `.equals()` compares the string representation of both ObjectIds.

---

**Q16: What is a `2dsphere` index?**

A MongoDB index that enables geospatial queries on GeoJSON data. `listingSchema.index({ geometry: "2dsphere" })` creates it. It allows queries like "find all listings within 10km of [lat,lon]" and is required for accurate spherical distance calculations.

---

**Q17: Explain the `$pull` MongoDB operator.**

`$pull` removes all elements from an array that match a given condition. `Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })` atomically removes the review ObjectId from the listing's `reviews` array without loading the full document into memory.

---

**Q18: What is the difference between `findByIdAndDelete` and `deleteOne`?**

`findByIdAndDelete` finds the document, removes it, AND returns the deleted document to the caller. This is essential because the Mongoose post-hook receives the deleted listing to cascade-delete its reviews. `deleteOne` doesn't return the deleted document.

---

### Authentication & Security

**Q19: How does passport-local-mongoose handle passwords?**

It uses PBKDF2 (a key derivation function) to hash passwords with a random salt. The hash and salt are stored in the User document. During login, it re-hashes the input password with the stored salt and compares. Plain-text passwords are never stored.

---

**Q20: Explain the serialize/deserialize process in Passport.**

- `serializeUser`: Determines what data is stored in the session (typically just `user._id`). Called once on login.
- `deserializeUser`: On every subsequent request, reads the stored ID from the session and queries the full user document from MongoDB. This is how `req.user` is populated.

---

**Q21: What vulnerability does `httpOnly: true` on cookies prevent?**

**Cross-Site Scripting (XSS).** If malicious JavaScript is injected into a page, it could use `document.cookie` to steal the session cookie. `httpOnly: true` tells the browser to block JavaScript access to the cookie — it can only be sent in HTTP headers, not read by scripts.

---

**Q22: Why is server-side validation necessary even with client-side validation?**

Client-side validation (HTML `required`, Bootstrap) can be bypassed by disabling JavaScript, using Postman, `curl`, or browser DevTools. Joi validation on the server is the authoritative guard — it always runs regardless of how the request was made.

---

**Q23: What is CSRF and does this project handle it?**

Cross-Site Request Forgery tricks a logged-in user into unknowingly submitting a request to another site. The current project does **not** implement CSRF tokens. This is a known gap — adding `csurf` middleware or using the `SameSite` cookie attribute would mitigate it.

---

**Q24: How does the redirect-after-login flow work?**

1. Unauthenticated user tries to visit `/listings/new`
2. `isLoggedIn` saves `req.originalUrl` to `req.session.redirectUrl` and redirects to `/login`
3. On POST to `/login`, `saveRedirectUrl` middleware copies `redirectUrl` from session to `res.locals` (before Passport regenerates the session)
4. After successful login, `loginUser` reads `res.locals.redirectUrl` and redirects there

---

### Cloud & File Upload

**Q25: Why is Cloudinary used over storing files on the server disk?**

1. **Scalability:** Server disk is limited and doesn't scale horizontally
2. **CDN:** Cloudinary serves images from edge servers globally
3. **Persistence:** Files survive server restarts, deployments, crashes
4. **Optimization:** Can auto-compress, resize, serve WebP

---

**Q26: How does Multer interact with Cloudinary?**

`multer-storage-cloudinary` is a Multer storage engine. Instead of writing the file to disk, Multer pipes the incoming file stream directly to Cloudinary's API. The result is at `req.file.path` (the Cloudinary URL) and `req.file.filename` (the public_id).

---

### Architecture & Design Patterns

**Q27: What is the MVC pattern and how does this project implement it?**

- **Model:** `models/` — Mongoose schemas define data structure and DB interactions
- **View:** `views/` — EJS templates render HTML
- **Controller:** `controllers/` — handles requests, calls models, passes data to views
- **Routes** in `routes/` are the glue — they receive HTTP requests and call the appropriate controller method

---

**Q28: What is RESTful design? How RESTful is this project?**

REST uses HTTP methods (GET, POST, PUT, DELETE) to perform CRUD on resources with meaningful URLs. This project closely follows REST — proper HTTP methods (via method-override), resource-based URLs, and stateless design.

---

**Q29: What design patterns are used in this project?**

1. **MVC** — Separation of concerns across Models, Views, Controllers
2. **Higher Order Function** — `wrapAsync` for DRY error handling
3. **Middleware chain** — composable, single-purpose functions in Express
4. **Factory/Plugin pattern** — `passport-local-mongoose` plugin adds methods to schema
5. **Observer/Hook pattern** — Mongoose post-hooks for cascade delete

---

**Q30: When would you add MongoStore for session storage?**

In production, default `express-session` stores sessions in memory — lost on restart, can't scale across multiple servers. `connect-mongo` (already installed) stores sessions in MongoDB, making them persistent and shareable. The code is commented out in `app.js`, indicating it was planned.

---

### Debugging & Real-World Scenarios

**Q31: How would you add a search feature?**

```js
// Add text index on model
listingSchema.index({ title: "text", location: "text" });

// In controller
const allListings = await Listings.find({
  $text: { $search: req.query.q }
});
```

Or use regex for partial matching: `Listings.find({ title: { $regex: req.query.q, $options: "i" } })`

---

**Q32: What would you do differently to improve this project?**

1. Add search/filter functionality
2. CSRF protection with `csurf` or SameSite cookie
3. Rate limiting on login with `express-rate-limit`
4. Delete old Cloudinary image when a listing's image is updated (currently orphaned)
5. Pagination on the index page
6. Input sanitization against NoSQL injection (`express-mongo-sanitize`)
7. Unit and integration tests with Jest/Mocha
8. Proper logging with Morgan or Winston

---

**Q33: What is the difference between `req.params`, `req.query`, and `req.body`?**

- `req.params`: Route parameters — `/listings/:id` → `req.params.id`
- `req.query`: URL query string — `/listings?q=beach` → `req.query.q`
- `req.body`: Data from HTTP request body (forms, JSON POST) — needs `express.urlencoded()` middleware

---

**Q34: Why does the review router use `mergeParams: true`?**

The review router is mounted at `/listings/:id/reviews`. Without `mergeParams: true`, the router's isolated scope can't see `:id` from the parent path. `mergeParams: true` merges the parent router's params into the child, making `req.params.id` available inside review routes.

---

**Q35: How would you scale this application?**

1. **Database:** MongoDB Atlas with auto-scaling replicas
2. **Sessions:** MongoDB-backed sessions via `connect-mongo`
3. **Images:** Already on Cloudinary CDN
4. **Server:** PM2 cluster mode or Kubernetes for multiple Node.js instances
5. **Caching:** Redis for frequently accessed listings
6. **Load Balancer:** Nginx or cloud load balancer

---

**Q36: What happens if `req.file` is undefined during listing creation?**

The `createListing` controller does `let url = req.file.path` without a null check — this would throw `Cannot read properties of undefined` if no file is uploaded. In practice, the `<input type="file" required>` HTML validation catches this. A production improvement would be to add a server-side check or use Joi to validate that the file exists.

---

**Q37: Describe a security vulnerability in the current UI and how you'd fix it.**

The "Delete Review" button is shown to all logged-in users (not just the review author) in the current UI. While the backend `isReviewAuthor` middleware blocks unauthorized deletions, the button shouldn't appear at all. Fix:

```ejs
<% if(currUsers && review.author && review.author._id.equals(currUsers._id)) { %>
  <form method="POST" action="...?_method=DELETE">
    <button>Delete Review</button>
  </form>
<% } %>
```

---

**Q38: What is `encodeURIComponent()` and why is it used in geocode.js?**

It encodes special characters (spaces, &, #, etc.) in a string so they're valid in a URL query string. Without it, an address like "New York, USA" would break the URL. `encodeURIComponent("New York, USA")` returns `"New%20York%2C%20USA"`.

---

**Q39: How are flash messages different from regular `res.locals` variables?**

Regular `res.locals` variables are destroyed after the current request-response cycle. Flash messages survive a **redirect** — they're stored in the session and consumed (read + cleared) on the next request. This makes them perfect for showing confirmation/error messages after redirects.

---

**Q40: What is the purpose of the `init/` folder?**

It's a **database seeder** — for development only. It wipes the `listings` collection and inserts 50 sample listings from `data.js` so developers can work with realistic data immediately after cloning the project. In production, this would never run.

---

### Quick-Fire Concept Table

| Concept | Answer |
|---------|--------|
| What is `dotenv`? | Loads `KEY=VALUE` pairs from `.env` file into `process.env` |
| What does `resave: false` do? | Prevents resaving unchanged sessions on every request (performance) |
| What does `saveUninitialized: true` do? | Creates session even for unauthenticated users |
| What is `ejs-mate`? | Adds layout inheritance to EJS (a base template system) |
| What is `passport.initialize()`? | Sets up Passport's request augmentation (adds `req.login`, `req.logout`, etc.) |
| What is `passport.session()`? | Connects Passport to session middleware to restore auth state per request |
| What is `connect-flash`? | Stores one-time messages in session, consumed on next request |
| What port does the app run on? | 8080 |
| What is the `$in` operator? | MongoDB: matches documents where field value is in a given array |
| What is `encodeURIComponent`? | Encodes special chars for safe URL inclusion |
| What does `express.urlencoded()` do? | Parses URL-encoded form data into `req.body` |
| What does `express.static()` do? | Serves files from the `public/` directory directly |

---

## Summary Cheat Sheet

```
Project:      Wanderlust — Airbnb-like travel listing platform
Language:     JavaScript (Node.js)
Framework:    Express.js v5
Database:     MongoDB (Mongoose ODM)
Auth:         Passport.js (Local Strategy + passport-local-mongoose)
Sessions:     express-session + connect-flash
Uploads:      Multer → multer-storage-cloudinary → Cloudinary CDN
Maps:         Leaflet.js + Nominatim (OpenStreetMap) Geocoding API
Validation:   Joi (server-side) + Bootstrap (client-side)
Views:        EJS + ejs-mate layouts + Bootstrap 5
Pattern:      MVC + RESTful routing + Middleware chain
Port:         8080
DB Name:      wanderlust
Collections:  listings, reviews, users
Key Files:    app.js, middleware.js, schema.js, cloudConfig.js, utils/wrapAsync.js
```

---

*Last updated: March 2026 | Prepared for Software Developer Interview | Project: Wanderlust (MAJOR-PROJECT1)*
