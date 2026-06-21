from exceptions.auth import *
from utils.password_util import verify_password
from utils.jwt_util import *
from repositories.auth import auth_repo

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

auth_service = AuthService()
