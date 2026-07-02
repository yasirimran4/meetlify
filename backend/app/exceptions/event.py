# exceptions/event.py

from exceptions.base import AppException


class EventNotFoundError(AppException):

   def __init__(
        self,
        message: str = "Event not found.",
        error_code: str = "EVENT_NOT_FOUND",
        status_code: int = 404,
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )


class EventAlreadyPublishedError(AppException):

    def __init__(
        self,
        message: str = "Event already published",
        error_code: str = "EVENT_ALREADY_PUBLISHED",
        status_code: int = 400,
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )


class InvalidFormat(AppException):

    def __init__(
        self,
        message: str = "Invalid format",
        error_code: str = "INVALID_FORMAT",
        status_code: int = 400,
    ):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status_code,
        )