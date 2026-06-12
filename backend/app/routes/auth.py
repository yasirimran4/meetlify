
from fastapi import APIRouter ,Depends 
from schemas.auth import *
from sqlalchemy.ext.asyncio import AsyncSession
from core.dependency import get_db
from services.auth import AuthService


auth_router = APIRouter(prefix='/api/v1/auth' ,tags=["Authentication"])

auth_service = AuthService()

@auth_router.post("/login",response_model = UserLoginResponse)
async def login(request:UserLogin,session:AsyncSession = Depends(get_db)):
    return await auth_service.login(request,session)



       