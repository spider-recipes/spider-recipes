const { randomBytes } = require('crypto');
const { promisify } = require('util');
const s3 = require('../config/s3');
require('dotenv').config({ override: true }); // Load environment variables from .env file

const bucketName = process.env.IMAGE_BUCKET_NAME;

async function generateUploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = ({
    Bucket: bucketName,
    Key: imageName,
    Expires: 60
  })

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  return uploadURL
}

module.exports = { generateUploadURL };

