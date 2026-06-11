
from fastapi import APIRouter
admin_router = APIRouter(prefix='/v1/api/admin' ,tags=["Admin"])

@admin_router.post('/create-event')
async def create_event():
    pass

@admin_router.get("/view-registerations")
async def view_registerations():
    pass