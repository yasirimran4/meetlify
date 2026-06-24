from core.database import SessionLocal
from fastapi.security import HTTPBearer , HTTPAuthorizationCredentials
from utils.jwt_util import decode_token
from fastapi import Depends , HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from repositories.auth import AuthRepository

async def get_db():    # Get session to work with database
    async with SessionLocal() as session:
        yield session

async def get_admin(credentials : HTTPAuthorizationCredentials = Depends(HTTPBearer()),session : AsyncSession = Depends(get_db)):

    token = credentials.credentials

    payload = decode_token(token)

    if payload is None or payload.get("type") != "access":
        raise HTTPException(status_code=401,detail="Unauthorized Access") 

    admin_id = payload.get("sub","")
    
    auth_repo = AuthRepository()

    admin = await auth_repo.find_user_by_id(int(admin_id),session=session)
    
    if admin is None:
        raise HTTPException(status_code=401,detail="Unauthorized Access. Admin not found") 
    
    return admin

    



