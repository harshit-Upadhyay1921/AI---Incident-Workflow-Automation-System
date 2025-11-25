import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const configureCloudinary = () => {
  console.log("🔗 Configuring Cloudinary with:");
  console.log({
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

const uploadOnCloudinary = async (localFilePath) => {
    if(!localFilePath){
        console.error("local file path is not provided!");
        return null;
    }
    try {
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        });

        console.log("File uploaded to Cloudinary:", response.secure_url);

        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
        return response;
    } catch (error) {
        console.log("upload on cloudinary failed, ",error);

        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

export {configureCloudinary,uploadOnCloudinary};