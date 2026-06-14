
from fastapi import APIRouter , Depends
from schemas.registration import CreateRegistration
from services.registration import RegitrationService
from core.dependency import get_db 
from sqlalchemy.ext.asyncio import AsyncSession


registration_router = APIRouter(prefix='/api/v1/registrations' ,tags=["Registeration"])
registration_service = RegitrationService()

@registration_router.post('/{event_id}/register')
async def register_event(event_id :int , payload : CreateRegistration,session: AsyncSession = Depends(get_db)):
    return await registration_service.register_event(event_id,payload,session)

@registration_router.get('/{event_id}/registrations')
async def list_registrations(event_id : int,session: AsyncSession = Depends(get_db)):
    return await registration_service.list_registrations(event_id,session)
