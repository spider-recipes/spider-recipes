require('dotenv').config(); // Load environment variables from .env file
const aws = require('aws-sdk')

const region = process.env.REGION

// Configure AWS SDK to automatically fetch credentials from EC2 instance metadata
var creds = new aws.EC2MetadataCredentials();
creds.refresh(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log(creds.accessKeyId);
  }
}
// if (creds.accessKeyId !== undefined) {
// console.log("Using EC2 instance metadata credentials")
// aws.config.credentials = creds;
// }
console.log("creds")
console.log(creds)

const s3 = new aws.S3({
  region,
  signatureVersion: 'v4'
})

console.log("s3")
console.log(s3)

module.exports = s3;
