//import { v2 as cloudinary } from 'cloudinary';
import cloudinary from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloud_name, 
        api_key: process.env.api_key, 
        api_secret: process.env.api_secret,
    });

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary.v2,
        params:{
            folder: 'distribuidoraoz',
            format: async (req, file)=> 'jpg', //o png o jepg... 
            public_id: (req, file) => file.originalname,
            allowedFormats: ['jpg', 'jpeg', 'png'],
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        },
    });

export const upload = multer({storage: storage});
