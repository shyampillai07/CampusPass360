const multer = require('multer');

const maxSizeMb = Number(process.env.UPLOAD_MAX_MB || 5);


const storage = multer.memoryStorage();


function pdfFileFilter(req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are accepted'));
  }
}

function pdfFileFilter(req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    const err = new Error('Only PDF files are accepted');
    err.status = 400;
    cb(err);
  }
}

const uploadReceiptPdf = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: maxSizeMb * 1024 * 1024, 
  },
});

module.exports = { uploadReceiptPdf };