# This file is for making global environment management

from pydantic_settings import BaseSettings , SettingsConfigDict
from dotenv import load_dotenv
import cloudinary
load_dotenv() # For loading env variable


class Setting(BaseSettings):
    DATABASE_URL : str | None 
    SECRET_KEY : str | None 
    SQL_ALCHEMY_URL :  str | None
    ACCESS_TOKEN_EXPIRE_MINUTES : int 
    ALGORITHM : str
    CLOUDINARY_CLOUD_NAME : str 
    CLOUDINARY_API_KEY: str     
    CLOUDINARY_API_SECRET: str 
    model_config = SettingsConfigDict(
        env_file = '.env',
        extra = 'ignore'
    )

settings =  Setting()

cloudinary.config(
    cloud_name = settings.CLOUDINARY_CLOUD_NAME,
    api_key = settings.CLOUDINARY_API_KEY,
    api_secret = settings.CLOUDINARY_API_SECRET,
    secure = True
)
