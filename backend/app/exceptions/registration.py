# exceptions/registration.py

from app.exceptions.base import AppException


class EventFullError(AppException):

    def __init__(
        self,
        message="No seats available"
    ):
        super().__init__(message)


class DuplicateRegistrationError(AppException):

    def __init__(
        self,
        message="User already registered"
    ):
        super().__init__(message)