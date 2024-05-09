var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join('uploads'))
    },
    filename: async function (req, file, cb) {
        var name = file.originalname ;
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