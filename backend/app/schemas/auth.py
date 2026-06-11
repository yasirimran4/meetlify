from pydantic import BaseModel , Field , EmailStr
from typing import Annotated

class UserLogin(BaseModel):
    email : Annotated[EmailStr,Field(...,description="Email of admin")]
    password : Annotated[str,Field(...,description="Password of admin")]

class UserLoginResponse(BaseModel):
    access_token : str
    token_type :  str