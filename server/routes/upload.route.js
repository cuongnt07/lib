var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')

function convertToFileName(text) {
    let baseName = path.basename(text, path.extname(text)); // Lấy tên file không bao gồm phần mở rộng
    let fileName = baseName
      .toLowerCase() // Chuyển đổi tất cả các ký tự sang chữ thường
      .trim() // Xóa khoảng trắng đầu và cuối chuỗi
      .normalize("NFD") // Chuyển đổi các ký tự dấu sang các ký tự không dấu
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các ký tự dấu
      .replace(/đ/g, "d") // Chuyển chữ "đ" thành "d"
      .replace(/[^a-zA-Z0-9]+/g, "-") // Thay thế các ký tự không phải chữ cái hoặc số bằng dấu "-"
      .replace(/^-+|-+$/g, ""); // Xóa các dấu "-" ở đầu hoặc cuối chuỗi
    return fileName + path.extname(text); // Thêm lại phần mở rộng của file
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads'))
    },
    filename: async function (req, file, cb) {
        var name = convertToFileName(file.originalname);
        cb(null, name);
    }
})
var upload = multer({
    storage: storage
})
var multiUpload = upload.fields([{name: 'main', maxCount: 10}]);

router.post('/upload', multiUpload, async function(req, res) {
    res.json({
        results: "ok",
        message: "Upload file successfully"
    });
});

router.get('/open-pdf/:filename', (req, res) => {
    const { filename } = req.params;
    const pdfPath = "uploads/" + filename;
  
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }
  
      res.contentType('application/pdf');
      res.send(data);
    });
});

router.get('/open-image/:filename', (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, '../uploads', filename);

    // Kiểm tra định dạng file
    if (path.extname(filename).toLowerCase() === '.jpg') {
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('File does not exist');
                return res.sendStatus(404);
            }

            res.sendFile(imagePath);
        });
    } else {
        res.status(400).send('Invalid file type. Only JPG files are allowed.');
    }
});

module.exports = router;