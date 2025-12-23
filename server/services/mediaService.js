import fs from 'fs';
import imagekit from '../config/imageKit.js';

export const uploadImage = async (file) => {
    try {
        const fileBuffer = fs.readFileSync(file.path);

        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: file.originalname,
            folder: '/blogs'
        });

        const optimizeImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        });

        // Clean up local file after upload if needed (Multer usually handles temp files, but good practice if not)
        // fs.unlinkSync(file.path); 

        return optimizeImageUrl;
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};
