
from sqlalchemy import select
from models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
import logging

logger  = logging.getLogger(__name__)

class AuthRepository:

    async def find_user_by_email(self,email,session:AsyncSession):
        try:
            
            user = await session.execute(select(User).where(User.email == email))
            return user.scalar_one_or_none()
        
        except Exception as e:
            logger.exception("DB Error. User not found.")    
        
    async def find_user_by_id(self,id:int,session:AsyncSession):
        try:
            user = await session.execute(select(User).where(User.id == id))
            return user.scalar_one_or_none()

        except Exception as e:
            logger.exception("DB Error. User not found") 
   
    
    async def create_user(self,user,session):
        try:
            session.add(user)

            await session.commit()

            await session.refresh(user)

            return user
        
        except Exception as e:
            logger.exception("DB Error. User not created.") 
   

auth_repo = AuthRepository()



