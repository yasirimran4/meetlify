
from typing import Any
class AppException(Exception):
    def __init__(
        self,
        message: str,
        error_code: str,
        status_code: int,
        errors: list[dict[str, Any]] | None = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.errors = errors or []

        super().__init__(message)    
          