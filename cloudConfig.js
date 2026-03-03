const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Check if Cloudinary credentials are available
const hasCloudinary =
  process.env.CLOUD_NAME &&
  process.env.CLOUD_API_KEY &&
  process.env.CLOUD_API_SECRET;

let storage;

if (hasCloudinary) {
  // ===== CLOUDINARY (cloud) STORAGE =====
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  // multer-storage-cloudinary v2 internally accesses cloudinary.v2,
  // so pass the root cloudinary module (not .v2)
  storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "Wanderlust_DEV",
    allowedFormats: ["jpg", "jpeg", "png", "avif", "webp", "gif", "svg"],
  });

  console.log("Image storage: Cloudinary");
} else {
  // ===== LOCAL DISK STORAGE (for localhost development) =====
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "public/uploads"));
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + path.extname(file.originalname));
    },
  });

  console.log("Image storage: Local disk (public/uploads)");
}

module.exports = {
  cloudinary: cloudinary.v2,
  storage,
};
