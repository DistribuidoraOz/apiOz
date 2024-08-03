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

export async function upImg(url){

    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           url, {
               public_id: `${public_id}`,
           }
       ).catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    const public_id = uploadResult.public_id;

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(`${public_id}`, {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(`${public_id}`, {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl); 
    
    return uploadResult;
};