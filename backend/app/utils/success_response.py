from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

def success_response(data=None, message="Success", meta=None, status_code=200):
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": jsonable_encoder(data) if data is not None else None,
            "meta": jsonable_encoder(meta) if meta is not None else {},
        }
    )

