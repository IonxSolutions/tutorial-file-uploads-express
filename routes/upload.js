const express = require('express');
const fetch = require('node-fetch');
const fileUpload = require('express-fileupload');
const FormData = require('form-data'); 
const fs = require('fs');
const router = express.Router();

router.use(fileUpload({
  // Configure file uploads with maximum file size 10MB
	limits: { fileSize: 10 * 1024 * 1024 },

  // Temporarily store uploaded files to disk, rather than buffering in memory
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

router.post('/', async function(req, res, next) {
  if (!req.files || !req.files.file) {
    return res.status(422).send('No files were uploaded');
  }

  const uploadedFile = req.files.file;

  // Print information about the file to the console
  console.log(`File Name: ${uploadedFile.name}`);
  console.log(`File Size: ${uploadedFile.size}`);
  console.log(`File MD5 Hash: ${uploadedFile.md5}`);
  console.log(`File Mime Type: ${uploadedFile.mimetype}`);

  // Scan the file for malware using the Verisys Antivirus API - the same concepts can be
  // used to work with the uploaded file in different ways
  try {
    // Attach the uploaded file to a FormData instance
    var form = new FormData();
    form.append('file_name', uploadedFile.name);
    form.append('file', fs.createReadStream(uploadedFile.tempFilePath), uploadedFile.name);

    const headers = {
      'X-API-Key': '<YOUR API KEY HERE>',
      'Accept': '*/*'
    };

    // Send the file to the Verisys Antivirus API
    const response = await fetch('https://eu1.api.av.ionxsolutions.com/v1/malware/scan/file', {
      method: "POST",
      body: form,
      headers: headers
    });

    // Did we get a response from the API?
    if (response.ok) {
      const result = await response.json();

      // Did the file contain a virus/malware?
      if (result.status === 'clean') {
        return res.send('Upload successful!');
      } else {
        return res.status(500).send('Uploaded file contained malware!');
      }
    } else {
      throw new Error('Unable to scan file: ' + response.statusText);
    }
  } catch (error) {
    // Forward the error to the Express error handler
    return next(error);
  } finally {
    // Remove the uploaded temp file
    fs.rm(uploadedFile.tempFilePath, () => {});
  }
});

module.exports = router;