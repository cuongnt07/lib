const db = require('../models/index');
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const path = require('path'); // Thêm thư viện path
const dotenv = require('dotenv');
const multer = require('multer');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

// Hàm convertToFileName
function convertToFileName(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid file name');
    }
  let baseName = path.basename(text, path.extname(text));
  let fileName = baseName
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return fileName + path.extname(text);
}

class BookLineController {
    async createNewBookLine(req, res) {
        try {
            const bookLine = req.body;
            const imageFile = req.files['image'][0]; // Truy cập file ảnh từ req.files
            const pdfFile = req.files['pdf'][0]; // Truy cập file PDF từ req.files

            if (!imageFile || !pdfFile) {
                return res.status(400).json({ message: 'Both image and PDF files are required.' });
            }

            const imageToken = uuidv4(); // Generate a unique token for the image file
            const pdfToken = uuidv4(); // Generate a unique token for the PDF file

            const imageFileName = convertToFileName(imageFile.originalname);
            const pdfFileName = convertToFileName(pdfFile.originalname);

            const imageBlob = bucket.file(imageFileName);
            const pdfBlob = bucket.file(pdfFileName);

            const imageBlobStream = imageBlob.createWriteStream({
                metadata: {
                    contentType: imageFile.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: imageToken,
                    },
                },
            });

            const pdfBlobStream = pdfBlob.createWriteStream({
                metadata: {
                    contentType: pdfFile.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: pdfToken,
                    },
                },
            });

            imageBlobStream.on('error', (err) => {
                res.status(500).json({ message: err.message });
            });

            pdfBlobStream.on('error', (err) => {
                res.status(500).json({ message: err.message });
            });

            let imageUploaded = false;
            let pdfUploaded = false;

            imageBlobStream.on('finish', async () => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageBlob.name)}?alt=media&token=${imageToken}`;
                imageUploaded = true;

                if (pdfUploaded) {
                    const pdfUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(pdfBlob.name)}?alt=media&token=${pdfToken}`;
                    createBookLine(imageUrl, pdfUrl);
                }
            });

            pdfBlobStream.on('finish', async () => {
                const pdfUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(pdfBlob.name)}?alt=media&token=${pdfToken}`;
                pdfUploaded = true;

                if (imageUploaded) {
                    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageBlob.name)}?alt=media&token=${imageToken}`;
                    createBookLine(imageUrl, pdfUrl); // Đảm bảo pdfUrl và imageUrl được định nghĩa trước khi sử dụng
                }
            });

            const createBookLine = async (imageUrl, pdfUrl) => {
                const newBookLine = await db.bookLine.create({
                    bookline_name: bookLine.bookline_name,
                    publisher_id: bookLine.publisher_id,
                    category_id: bookLine.category_id,
                    thumbnail: imageUrl, // Lưu URL của ảnh vào thumbnail
                    document_url: pdfUrl // Lưu URL của PDF vào document_url
                });

                const authorId = bookLine.author_id;

                await db.authorBook.create({
                    bookline_id: newBookLine.bookline_id,
                    author_id: authorId
                });

                return res.status(200).json({
                    errCode: 0,
                    msg: 'Create book line and author book record successfully!',
                    imageUrl: imageUrl,
                    document_url: pdfUrl
                });
            };

            imageBlobStream.end(imageFile.buffer);
            pdfBlobStream.end(pdfFile.buffer);
        } catch(err) {
            console.log(err)
            return res.status(500).json("error")
        }
    }

    async updateBookLine(req, res) {
        try{
        const bookline_id = req.params.id
        const bookLine = req.body
        const data = await db.bookLine.findOne({
            where: {
                bookline_id
            }
        })
        await db.bookLine.update({
            bookline_name: bookLine.bookline_name,
            publisher_id: bookLine.publisher_id,
            category_id: bookLine.category_id,
            thumnail: bookLine.bookline_name == null ? data.thumnail : convertToFileName(bookLine.bookline_name)
        }, {
            where: {
                bookline_id
            }
        })
        return res.status(200).json({
            errCode: 0,
            msg: 'Update book line successfully!'
        }) 
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)

    }
}
    
    async getAllBookLine(req, res) {
        try {
        const booklines = await db.bookLine.sequelize.query(`select book_lines.bookline_id as _id, bookline_name, thumbnail, document_url, categories.category_name, description as category_description, GROUP_CONCAT(DISTINCT author_name ORDER BY author_name ASC SEPARATOR ', ') as authors
        , publisher_name, publishers.address as publisher_address, publishers.phone as publisher_phone from book_lines
        inner join categories on categories.category_id = book_lines.category_id
        inner join author_books on author_books.bookline_id = book_lines.bookline_id
        inner join authors on authors.author_id = author_books.author_id
        inner join publishers on publishers.publisher_id = book_lines.publisher_id
        group by _id`,
        { type: QueryTypes.SELECT })
        return res.status(200).json({
            booklines
        })
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
}

    // lấy ra tên các dòng sách và số lượng của chúng
    async getAllBookLineNames(req, res) {
        try {
        const bookLines = await db.bookLine.findAll({
            include: [
            {
                model: db.book,
                attributes: [],
            },
            ],
            attributes: [
            "bookline_name",
            [sequelize.fn("COUNT", sequelize.col("*")), "quantity"],
            ],
            group: ["book_lines.bookline_name"],
        });
        return res.status(200).json({
            errCode: 0,
            data: bookLines,
            msg: "Get book lines successfully!",
        });
        } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json("error");
        }
    }

    //Đếm số lượng dòng s��ch 
    async getBookLineCount(req, res) {
        try {
          const bookLineCount = await db.book.sequelize.query(
            `SELECT COUNT(*) as number_of_booklines
              FROM book_lines
              `,
            { type: QueryTypes.SELECT }
          );
          return res.status(200).json({
            errCode: 0,
            result: bookLineCount,
            msg: "Get book count successfully!",
          });
        } catch (err) {
          console.log(err);
          return res.status(500).json("error");
        }
      }
}
module.exports = new BookLineController;
