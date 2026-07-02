# exceptions/registration.py
from exceptions.base import AppException


class DuplicateRegistrationError(AppException):
    def __init__(
        self,
        message: str = "You are already registered for this event.",
        error_code: str = "ALREADY_REGISTERED",
        status_code: int = 409,
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )


class RegistrationAlreadyCancelledError(AppException):
    def __init__(
        self,
        message: str = "Registration has already been cancelled.",
        error_code: str = "REGISTRATION_ALREADY_CANCELLED",
        status_code: int = 409,
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )