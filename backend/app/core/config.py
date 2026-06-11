# This file is for making global environment management

from pydantic_settings import BaseSettings , SettingsConfigDict
from dotenv import load_dotenv
import os
load_dotenv() # For loading env variable

DATABASE_URL = os.getenv('DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')

class Setting(BaseSettings):
    DATABASE_URL : str | None = DATABASE_URL
    SECRET_KEY : str | None = SECRET_KEY 

    model_config = SettingsConfigDict(
        env_file = '.env',
        extra = 'ignore'
    )

settings =  Setting()

