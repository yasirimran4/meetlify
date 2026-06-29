# Auth Routes login only for admin no signup

from fastapi import APIRouter ,Depends ,HTTPException, status
from schemas.auth import *
from sqlalchemy.ext.asyncio import AsyncSession
from core.dependency import get_db
from services.auth import auth_service
from utils.jwt_util import decode_token , create_access_token
auth_router = APIRouter(prefix='/api/v1/auth' ,tags=["Authentication"])


@auth_router.post("/login",response_model = UserLoginResponse)
async def login(request:UserLogin,session:AsyncSession = Depends(get_db)):
    return await auth_service.login(request,session)

@auth_router.post("/refresh")
async def refresh_token(token:str):
    payload = decode_token(token=token)
    
    if payload is None:
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials") 
    
    if payload.get("type") != "refresh":
        raise HTTPException( status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials") 

    access_token = create_access_token({"sub" : payload["sub"]})  

    return {"access_token" : access_token}

       