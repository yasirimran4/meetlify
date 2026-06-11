# This file is for making global environment management

from pydantic_settings import BaseSettings , SettingsConfigDict
from dotenv import load_dotenv
load_dotenv() # For loading env variable


class Setting(BaseSettings):
    DATABASE_URL : str | None 
    SECRET_KEY : str | None 

    model_config = SettingsConfigDict(
        env_file = '.env',
        extra = 'ignore'
    )

settings =  Setting()

