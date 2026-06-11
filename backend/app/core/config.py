# This file is for making global environment management

from pydantic_settings import BaseSettings , SettingsConfigDict
from dotenv import load_dotenv
load_dotenv() # For loading env variable


class Setting(BaseSettings):
    DATABASE_URL : str | None 
    SECRET_KEY : str | None 
    SQL_ALCHEMY_URL :  str | None
    ACCESS_TOKEN_EXPIRE_MINUTES : int 
    ALGORITHM : str

    model_config = SettingsConfigDict(
        env_file = '.env',
        extra = 'ignore'
    )

settings =  Setting()

