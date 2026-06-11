
from sqlalchemy import select
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
class AuthRepository:

    async def find_user_by_email(self,email,session:AsyncSession):
        user = await session.execute(select(User).where(User.email == email))
        return user.scalar_one_or_none()
    
    async def create_user(self,user,session):

        session.add(user)

        await session.commit()

        await session.refresh(user)

        return user


