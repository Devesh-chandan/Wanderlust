const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";






main()
.then(()=>{
    console.log("connected to DB"); 
})
.catch(
    (err) => {console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
   await  Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>
    ({...obj,
        owner:"696792fbd33f178f7dea3fd9"})
   );
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
};

initDB();




// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listings.js");
// const path = require("path");

// // 1. Correctly load the .env file from the parent directory
// require("dotenv").config({ path: path.join(__dirname, "../.env") });

// const dbUrl = process.env.ATLASDB_URL;

// // 2. Define the database connection AND initialization flow
// async function main() {
//   if (!dbUrl) {
//     throw new Error("ATLASDB_URL is not defined. Check your .env file location.");
//   }
  
//   console.log("Connecting to Atlas...");
//   await mongoose.connect(dbUrl);
//   console.log("Connected to DB");
  
//   // 3. Only run initDB AFTER the connection is complete
//   await initDB();
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
  
//   // REPLACE "YOUR_COPIED_ID" BELOW WITH YOUR ACTUAL ATLAS USER ID
//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     // owner: "6790fb055e886b51c8a164b6",
//      owner:validOwnerId,  // Example ID, replace with yours!
//   }));
  
//   await Listing.insertMany(initData.data);
//   console.log("Data initialized successfully");
// };

// // 4. Start the process
// main()
//   .then(() => {
//     // Optional: Close connection when done
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log(err);
//   });





// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listings.js");
// const path = require("path");

// // Load the .env file from the root directory
// require("dotenv").config({ path: path.join(__dirname, "../.env") });

// const dbUrl = process.env.ATLASDB_URL;

// async function main() {
//   if (!dbUrl) {
//     console.error("Error: ATLASDB_URL is missing from .env file!");
//     process.exit(1);
//   }
  
//   console.log("Connecting to Atlas...");
//   await mongoose.connect(dbUrl);
//   console.log("Connected to Atlas DB");
  
//   await initDB();
// }

// const initDB = async () => {
//   // 1. Delete the broken listings
//   await Listing.deleteMany({});
//   console.log("Cleared old data");

//   // 2. Assign the CORRECT Owner ID
//   // PASTE YOUR ATLAS USER ID BELOW inside the quotes
//   const validOwnerId = "PASTE_YOUR_COPIED_ID_HERE"; 

//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: validOwnerId, 
//   }));

//   // 3. Insert new listings
//   await Listing.insertMany(initData.data);
//   console.log("Data initialized with valid owner!");
// };

// main()
//   .then(() => {
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log(err);
//   });









// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listings.js");
// const User = require("../models/user.js"); // Import User model to verify ID
// const path = require("path");

// // Load .env from the root directory
// require("dotenv").config({ path: path.join(__dirname, "../.env") });

// const dbUrl = process.env.ATLASDB_URL;

// async function main() {
//   if (!dbUrl) {
//     console.error("❌ ERROR: ATLASDB_URL is missing! Check your .env file.");
//     process.exit(1);
//   }

//   console.log("⏳ Connecting to Atlas...");
//   await mongoose.connect(dbUrl);
//   console.log("✅ Connected to Atlas DB");

//   // PASTE YOUR COPIED USER ID HERE
//   const ownerId = "69722df3fd8907e50410d760"; 

//   // 1. SAFETY CHECK: Verify the User ID exists BEFORE wiping data
//   const foundUser = await User.findById(ownerId);
//   if (!foundUser) {
//     console.error(`❌ ERROR: User with ID '${ownerId}' does not exist in the database.`);
//     console.error("   Stop! Do not delete existing data.");
//     console.error("   Please go to Atlas > Collections > users and copy a valid _id.");
//     process.exit(1); // Stop the script here
//   }
//   console.log(`✅ User found: ${foundUser.username} (ID is valid)`);

//   // 2. Only now is it safe to clear the database
//   await Listing.deleteMany({});
//   console.log("🗑️  Cleared old data");

//   // 3. Assign the valid owner and insert
//   initData.data = initData.data.map((obj) => ({
//     ...obj,
//     owner: ownerId,
//   }));

//   await Listing.insertMany(initData.data);
//   console.log("🎉 Success! Data initialized.");
// }

// main()
//   .then(() => {
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log("❌ SCRIPT FAILED:", err);
//   });