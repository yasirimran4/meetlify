from dotenv import load_dotenv
import os
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.password_util import hash_password
from app.core.dependency import get_db
from app.models.user import User
from app.repositories.auth import AuthRepository
from app.exceptions.auth import UserAlreadyExist
from app.core.database import SessionLocal
import asyncio

load_dotenv()

auth_repo = AuthRepository()

admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")


async def create_admin():
    async with SessionLocal() as session:
        admin = await auth_repo.find_user_by_email(admin_email,session=session)


        if admin is not None:
            raise UserAlreadyExist()
        
        hashed_password = hash_password(admin_password)

        user = User(
            name = 'Yasir',
            email = admin_email,
            hashed_password = hashed_password
        )

        admin = await auth_repo.create_user(user=user,session=session)

        print("Admin created successfully",admin)


asyncio.run(create_admin())

