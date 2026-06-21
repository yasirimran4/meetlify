
import cloudinary.uploader

class CloudinaryService:
    async def upload_image(self,file):
        result =  cloudinary.uploader.upload(
            file.file
        )

        return {
            "url" : result.get("secure_url"),
            "public_id" : result.get("public_id")
        }

    async def delete_image(self,public_id):
        result = cloudinary.uploader.destroy(public_id=public_id)
        return result


cloudinary_service = CloudinaryService() 
