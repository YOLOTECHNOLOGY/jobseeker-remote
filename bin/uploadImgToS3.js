const AWS = require('aws-sdk')
require('aws-sdk/lib/maintenance_mode_message').suppress = true
const traverseFolder = require('./handleImg')
const fs = require('fs')
const path = require('path')
const env = process.argv[2]

// Set the region
AWS.config.update({ region: 'ap-southeast-1' })

// Create S3 service object
// s3 = new AWS.S3({apiVersion: '2006-03-01'});

const s3 = new AWS.S3()

const file_namespace = 'profile'
const directoryPath = 'components/ProfileLayout'
const targetPath = `jobseeker/${file_namespace}/`
const devBucket = 'dev-assets.bossjob.com'
const prodBucket = 'assets.bossjob.com'

let totalFiles = 0
let uploadedFiles = 0

const isProduction = env === 'prod'
// Function to upload an image file to S3
function uploadImageToS3(filePath) {
  // Read the image file
  const fileContent = fs.readFileSync(filePath)

  // Set the parameters for the S3 upload
  const params = {
    Bucket: env === 'prod' ? prodBucket : devBucket,
    Key: `${targetPath}${path.basename(filePath)}`,
    Body: fileContent
  }

  // Upload the image to S3
  s3.upload(params, function (err, data) {
    if (err) {
      console.error(`Error uploading ${filePath} to S3:`, err)
    } else {
      console.log(`Image ${filePath} uploaded successfully:`, data.Location)
      // Remove the local file after uploading it
      uploadedFiles++
      console.log('totalFiles', totalFiles)
      console.log('uploadedFiles', uploadedFiles)
      if (uploadedFiles === totalFiles) {
        traverseFolder(directoryPath, file_namespace)
      }
      if (!isProduction) return
      fs.unlink(filePath, function (err) {
        if (err) {
          console.error(`Error removing ${filePath}:`, err)
        } else {
          console.log(`Local file ${filePath} removed successfully`)
        }
      })
      // Increment the uploaded files counter

      // Check if all files have been uploaded
    }
  })
}

if (!env) {
  console.log('Provide env name as a command-line argument, prod or dev, dev is default')
}
// Read the files in the directory
function readFilesRecursively(directoryPath) {
  const files = fs.readdirSync(directoryPath)

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      readFilesRecursively(filePath)
    } else {
      const extension = path.extname(file).toLowerCase()
      if (['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'].includes(extension)) {
        console.log('filePath', filePath)
        totalFiles++
        uploadImageToS3(filePath)
      }
    }
  })
}

readFilesRecursively(directoryPath)
