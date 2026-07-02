# exceptions/auth.py

from exceptions.base import AppException


class InvalidCredentialsError(AppException):
    def __init__(
        self,
        message: str = "Invalid email or password.",
        error_code: str = "AUTH_INVALID_CREDENTIALS",
        status_code: int = 401,
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )
        
class UserNotFoundError(AppException):

    def __init__(
        self,
        message: str = "User not found",
        error_code = "USER_NOT_FOUND",
        status_code = 404
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )

class UserAlreadyExist(AppException):
    message = "User already exists"
    error_code = "USER_ALREADY_EXISTS"
    status_code = 409

    def __init__(self):
        super().__init__(
            message=self.message,
            error_code=self.error_code,
            status_code=self.status_code,
        )

