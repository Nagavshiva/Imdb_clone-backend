const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

// Specify the Cloudinary folder
const cloudinaryFolder = 'client/public/images';

// Configure multer storage with Cloudinary and the specified folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: cloudinaryFolder,
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Set up multer with the configured storage
const multerConfig = multer({ storage });

module.exports = multerConfig;
