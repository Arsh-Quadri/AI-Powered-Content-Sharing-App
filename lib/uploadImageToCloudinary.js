import axios from "axios";
import sha1 from "js-sha1";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "@env";

const CLOUD_NAME = "dhpe0g5zg";

export const uploadImageToCloudinary = async (imageUri) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg", // or 'image/png'
    name: "upload.jpg",
  });

  const timestamp = Math.floor(Date.now() / 1000);
  formData.append("timestamp", timestamp);

  const signatureString = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = sha1(signatureString);

  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("signature", signature);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    // console.log(response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error(
      error.message ||
        "An error occurred while uploading the image to Cloudinary"
    );
  }
};
