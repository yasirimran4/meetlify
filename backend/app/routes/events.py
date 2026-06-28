
from fastapi import APIRouter , Depends , Query
from core.dependency import get_db ,get_admin
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from services.event import event_service
from schemas.registration import *
from services.registration import registration_service
event_router = APIRouter(prefix='/api/v1/events' ,tags=["Events"])


@event_router.get('/upcoming')   
async def get_upcoming_events(page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),search : str = Query(default=None,max_length=100),session: AsyncSession = Depends(get_db)):
    return await event_service.get_upcoming_events(page,limit,search,session)

@event_router.get('/completed')
async def get_completed_events(page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),search : str = Query(default="",max_length=100),session: AsyncSession = Depends(get_db)):
    return await event_service.get_completed_events(page,limit,search,session)

@event_router.get('/{event_id}')
async def get_single_event(event_id:int,session: AsyncSession = Depends(get_db)):
    return await event_service.get_single_event(session,event_id)

@event_router.post('/{event_id}/register')   
async def register_event(event_id :int , request : CreateRegistration,session: AsyncSession = Depends(get_db)):
    return await registration_service.register_event(event_id,request,session)

@event_router.get('/{event_id}/analytics')   
async def event_analytics(event_id :int ,session: AsyncSession = Depends(get_db)):
    return await registration_service.event_analytics(event_id,session)

