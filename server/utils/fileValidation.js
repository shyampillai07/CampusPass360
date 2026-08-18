const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// The first 5 bytes of every real PDF file are literally the characters
// "%PDF-" — this is the file's "magic bytes." Checking this is far more
// reliable than trusting req.file.mimetype (which is just whatever the
// CLIENT claimed the file is — trivially fakeable) or the filename
// extension (equally fakeable — you can rename virus.exe to receipt.pdf).
const PDF_MAGIC_BYTES = Buffer.from('%PDF-', 'ascii');

function isRealPdf(buffer) {
  if (!buffer || buffer.length < PDF_MAGIC_BYTES.length) return false;
  return buffer.subarray(0, PDF_MAGIC_BYTES.length).equals(PDF_MAGIC_BYTES);
}

// Generates a filename WE control — never derived from the user-supplied
// original filename. If we used the original filename directly, a
// malicious upload named "../../server.js" could overwrite files outside
// the uploads folder entirely (a "path traversal" attack). A random name
// with a fixed, known-safe extension sidesteps that risk completely.
function generateSafeFilename(extension) {
  const randomName = crypto.randomUUID();
  return `${randomName}${extension}`;
}


async function saveUploadedFile(buffer, extension) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = generateSafeFilename(extension);
  const fullPath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(fullPath, buffer);
  return filename;
}

function getUploadPath(filename) {
  return path.join(UPLOAD_DIR, filename);
}

module.exports = {
  isRealPdf,
  saveUploadedFile,
  getUploadPath,
  UPLOAD_DIR,
};