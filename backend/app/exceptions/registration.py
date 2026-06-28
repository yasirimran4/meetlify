# exceptions/registration.py

from exceptions.base import AppException


class DuplicateRegistrationError(AppException):

    def __init__(
        self,
        message="User already registered"
    ):
        super().__init__(message)

