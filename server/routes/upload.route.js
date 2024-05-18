// const express = require('express');
// const dotenv = require('dotenv');
// const admin = require('firebase-admin');
// const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');
// const path = require('path'); // Thêm thư viện path

// // Hàm convertToFileName
// function convertToFileName(text) {
//   let baseName = path.basename(text, path.extname(text));
//   let fileName = baseName
//     .toLowerCase()
//     .trim()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/đ/g, "d")
//     .replace(/[^a-zA-Z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
//   return fileName + path.extname(text);
// }

// // Load environment variables
// dotenv.config();

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   }),
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
// });

// const bucket = admin.storage().bucket();

// // Initialize Express app
// const router = express();

// // Configure multer for file uploads
// const upload = multer({ storage: multer.memoryStorage() });

// // Route to upload a file
// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const file = req.file;
//     const token = uuidv4(); // Generate a unique token for the file

//     // Convert file name before uploading
//     const fileName = convertToFileName(file.originalname);

//     // Upload the file to Firebase Storage
//     const blob = bucket.file(fileName);
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//         metadata: {
//           firebaseStorageDownloadTokens: token,
//         },
//       },
//     });

//     blobStream.on('error', (err) => {
//       res.status(500).send({ message: err.message });
//     });

//     blobStream.on('finish', () => {
//       const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${token}`;
//       res.status(200).send({ fileUrl: publicUrl });
//     });

//     blobStream.end(file.buffer);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });


// module.exports = router;
// module.exports = router;