var express = require('express');
var router = express.Router();
var S3Service = require('../services/s3-service.js');

router.get('/putImage', async (req, res) => {
  console.log("Here")
  const url = await S3Service.generateUploadURL()
  res.send({ url })
})

module.exports = router;
