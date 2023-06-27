const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const env = process.argv[2];

// Set the region
AWS.config.update({region: 'ap-southeast-1'});

// Create S3 service object
// s3 = new AWS.S3({apiVersion: '2006-03-01'});

const s3 = new AWS.S3();

const directoryPath = 'app/[lang]/talents/updateImage';
const targetPath = 'jobseeker/landing/';
const devBucket = 'dev-assets.bossjob.com';
const prodBucket = 'assets.bossjob.com';



// Function to upload an image file to S3
function uploadImageToS3(filePath) {
	// Read the image file
	const fileContent = fs.readFileSync(filePath);

	// Set the parameters for the S3 upload
	const params = {
		Bucket: env === 'prod' ?  prodBucket :  devBucket,
		Key: `${targetPath}${path.basename(filePath)}`,
		Body: fileContent
	};

	// Upload the image to S3
	s3.upload(params, function (err, data) {
		if (err) {
			console.error(`Error uploading ${filePath} to S3:`, err);
		} else {
			console.log(`Image ${filePath} uploaded successfully:`, data.Location);
		}
	});
}




if (!env) {
	console.error('Provide env name as a command-line argument, prod or dev, dev is default');
}
// Read the files in the directory
fs.readdir(directoryPath, function (err, files) {
	if (err) {
		console.error('Error reading directory:', err);
	} else {
		// Filter the files to include only image files (e.g., .jpg, .png)
		const imageFiles = files.filter(file => {
			const extension = path.extname(file).toLowerCase();
			return ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'].includes(extension);
		});

		// Upload each image file
		imageFiles.forEach(file => {
			const filePath = path.join(directoryPath, file);
			uploadImageToS3(filePath);
		});
	}
});
