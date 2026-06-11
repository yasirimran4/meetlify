
from fastapi import APIRouter
registration_router = APIRouter(prefix='/api/v1/events' ,tags=["Registeration"])


@registration_router.post("/{event_id}/register")
async def register_event():
    pass

@registration_router.get("/{event_id}/registrations")
async def list_registerations():
    pass

@registration_router.get("/{event_id}/registrations/count")
async def registration_count():
    pass