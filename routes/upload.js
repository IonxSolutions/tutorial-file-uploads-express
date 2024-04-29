const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();

router.use(fileUpload({
  // Configure file uploads with maximum file size 10MB
	limits: { fileSize: 10 * 1024 * 1024 },

  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

router.post('/', async function(req, res, next) {
  // Was a file submitted?
  if (!req.files || !req.files.file) {
    return res.status(422).send('No files were uploaded');
  }

  const uploadedFile = req.files.file;

  // Print information about the file to the console
  console.log(`File Name: ${uploadedFile.name}`);
  console.log(`File Size: ${uploadedFile.size}`);
  console.log(`File MD5 Hash: ${uploadedFile.md5}`);
  console.log(`File Mime Type: ${uploadedFile.mimetype}`);

  // Return a web page showing information about the file
  res.send(`File Name: ${uploadedFile.name}<br>
  File Size: ${uploadedFile.size}<br>
  File MD5 Hash: ${uploadedFile.md5}<br>
  File Mime Type: ${uploadedFile.mimetype}`);
});

module.exports = router;