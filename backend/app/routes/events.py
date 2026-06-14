
from fastapi import APIRouter , Depends , UploadFile , File , HTTPException , Query
from core.dependency import get_db ,get_admin
from sqlalchemy.ext.asyncio import AsyncSession
from services.event import EventService
from models.user import User
from schemas.event import CreateEventRequest
from models.event import Status
from pydantic import AnyUrl
event_router = APIRouter(prefix='/api/v1/events' ,tags=["Events"])

event_service = EventService()

@event_router.post('/')
async def create_event(payload : CreateEventRequest,session: AsyncSession = Depends(get_db)):
    try:
        return await event_service.create_event(payload,session)
    except HTTPException:
        raise HTTPException(status_code=400,detail="Something went wrong")

@event_router.post('/upload-thumbnail')
async def upload_thumbnail(thumbnail : UploadFile = File(...),session: AsyncSession = Depends(get_db)):
    return await event_service.upload_thumbnail(thumbnail,session)

@event_router.get('/upcoming')
async def get_upcoming_events(page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),search : str = Query(default="",max_length=100),session: AsyncSession = Depends(get_db)):
    return await event_service.get_upcoming_events(page,limit,search,session)

@event_router.get('/past')
async def get_past_events(page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),search : str = Query(default="",max_length=100),session: AsyncSession = Depends(get_db)):
    return await event_service.get_past_events(page,limit,search,session)

@event_router.get('/{event_id}/')
async def get_single_event(event_id:int,session: AsyncSession = Depends(get_db)):
    return await event_service.get_single_event(session,event_id)

@event_router.put('/{event_id}/')
async def update_event(event_id:int,payload : CreateEventRequest,session: AsyncSession = Depends(get_db)):
    return await event_service.update_event(session,event_id,payload)

@event_router.put('/{event_id}/upload-video-url')
async def upload_video_url(event_id:int,video_url : AnyUrl,session: AsyncSession = Depends(get_db)):
    return await event_service.upload_video_url(session,event_id,video_url)

@event_router.patch('/{event_id}/status')
async def change_status(event_id:int,status : Status = Query(default='PUBLISHED'),session: AsyncSession = Depends(get_db) ):
    return await event_service.change_status(session,event_id,status)

@event_router.delete('/{event_id}/')
async def delete_event(event_id:int,session: AsyncSession = Depends(get_db)):
    return await event_service.delete_event(session,event_id)

