# exceptions/event.py

from exceptions.base import AppException


class EventNotFoundError(AppException):

    def __init__(
        self,
        message="Event not found"
    ):
        super().__init__(message)


class EventAlreadyPublishedError(AppException):

    def __init__(
        self,
        message="Event already published"
    ):
        super().__init__(message)


class RegistrationDeadlinePassedError(AppException):

    def __init__(
        self,
        message="Registration deadline has passed"
    ):
        super().__init__(message)