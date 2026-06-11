# exceptions/auth.py

from app.exceptions.base import AppException


class InvalidCredentialsError(AppException):

    def __init__(
        self,
        message: str = "Invalid email or password"
    ):
        super().__init__(message)


class UserAlreadyExist(AppException):

    def __init__(
        self,
        message: str = "User already exists"
    ):
        super().__init__(message)
 
class UserNotFoundError(AppException):

    def __init__(
        self,
        message: str = "User not found"
    ):
        super().__init__(message)