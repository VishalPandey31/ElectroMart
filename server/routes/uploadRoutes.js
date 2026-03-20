const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('No file uploaded'); }
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;
  const result = await cloudinary.uploader.upload(dataURI, { folder: 'electromart', transformation: [{ width: 800, crop: 'limit' }] });
  res.status(200).json({ success: true, url: result.secure_url, publicId: result.public_id });
});

const deleteImage = asyncHandler(async (req, res) => {
  await cloudinary.uploader.destroy(req.body.publicId);
  res.status(200).json({ success: true, message: 'Image deleted' });
});

router.post('/image', protect, vendor, upload.single('image'), uploadImage);
router.delete('/image', protect, vendor, deleteImage);

module.exports = router;
