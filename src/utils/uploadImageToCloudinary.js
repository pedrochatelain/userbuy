const { v2: cloudinary } = require('cloudinary');
const { PassThrough } = require('stream');

async function uploadImageToCloudinary(imageBuffer) {
    try {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Upload the image using a stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });

            // Pipe the image buffer to the upload stream
            const bufferStream = new PassThrough();
            bufferStream.end(imageBuffer);
            bufferStream.pipe(uploadStream);
        });

        return {
            message: 'Image successfully uploaded to Cloudinary',
            url: result.url,
        };
    } catch (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }
}

module.exports = uploadImageToCloudinary
