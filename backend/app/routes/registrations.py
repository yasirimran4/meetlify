
from fastapi import APIRouter
from schemas.registration import CreateRegistration

registration_router = APIRouter(prefix='/api/v1/events' ,tags=["Registeration"])


@registration_router.post("/{event_id}/register")
async def register_event(payload : CreateRegistration):
    pass

@registration_router.get("/{event_id}/registrations")
async def list_registerations(event_id : int):
    pass

@registration_router.get("/{event_id}/registrations/count")
async def registration_count(event_id : int):
    pass