from app.repositories.auth import AuthRepository
from app.exceptions.auth import *
from app.utils.password_util import verify_password
from app.utils.jwt_util import *

auth_repo = AuthRepository()

class AuthService:
    async def login(self,request,session):

        user = await auth_repo.find_user_by_email(request.email,session=session)

        if not user:
            raise UserNotFoundError()
        
        is_password_correct = verify_password(request.password,user.hashed_password)

        if not is_password_correct:
            raise InvalidCredentialsError()
         
        access_token = create_access_token({'sub':str(user.id)})

        
        return {"access_token" : access_token,"token_type":'bearer'}
