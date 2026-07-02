
import logging

from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from exceptions.base import AppException

logger = logging.getLogger(__name__)

async def app_exception_handler(
    request: Request,
    exc: AppException,
):
    logger.warning(
        "[%s] %s",
        exc.error_code,
        exc.message,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "error_code": exc.error_code,
            "errors": exc.errors,
        },
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
):
    errors = []

    for err in exc.errors():
        field = ".".join(map(str, err["loc"][1:]))

        errors.append(
            {
                "field": field,
                "message": err["msg"],
            }
        )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed.",
            "error_code": "VALIDATION_ERROR",
            "errors": errors,
        },
    )


async def generic_exception_handler(
    request: Request,
    exc: Exception,
):
    logger.exception(exc)

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "errors": [],
        },
    )