# exceptions/event.py

from exceptions.base import AppException


class EventNotFoundError(AppException):

    def __init__(
        self,
        message="Event not found"
    ):
        super().__init__(message,status_code=404)


class EventAlreadyPublishedError(AppException):

    def __init__(
        self,
        message="Event already published"
    ):
        super().__init__(message,status_code=400)

class InvalidFomrat(AppException):

    def __init__(self):
        super().__init__(message="Invalid Format",status_code=400) 

