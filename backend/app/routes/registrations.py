
from fastapi import APIRouter , Depends
from schemas.registration import CreateRegistration
from core.dependency import get_db ,get_admin
from sqlalchemy.ext.asyncio import AsyncSession
from services.registration import registration_service
from models.user import User

registration_router = APIRouter(prefix='/api/v1/registrations' ,tags=["Registeration"])

@registration_router.post('/{event_id}/register')   
async def register_event(event_id :int , request : CreateRegistration,session: AsyncSession = Depends(get_db)):
    return await registration_service.register_event(event_id,request,session)

@registration_router.get('/{event_id}/registrations')    # Protected Route
async def list_registrations(event_id : int,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await registration_service.list_registrations(event_id,session)
