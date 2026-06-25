
from fastapi import APIRouter , Depends , UploadFile , File , HTTPException , Query
from core.dependency import get_db ,get_admin
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User
from schemas.event import CreateEventRequest
from models.event import Status
from pydantic import AnyUrl
from services.event import event_service

event_router = APIRouter(prefix='/api/v1/events' ,tags=["Events"])

@event_router.post('/upload-thumbnail')
async def upload_thumbnail(thumbnail : UploadFile = File(...)):
    return await event_service.upload_thumbnail(thumbnail)

@event_router.post('/')     #  Protected Route
async def create_event(request : CreateEventRequest,session: AsyncSession = Depends(get_db)):
    return await event_service.create_event(request,session)

@event_router.get('/upcoming')   
async def get_upcoming_events(page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),search : str = Query(default=None,max_length=100),session: AsyncSession = Depends(get_db)):
    return await event_service.get_upcoming_events(page,limit,search,session)

@event_router.get('/completed')
async def get_completed_events(page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),search : str = Query(default="",max_length=100),session: AsyncSession = Depends(get_db)):
    return await event_service.get_completed_events(page,limit,search,session)

@event_router.get('/{event_id}/')
async def get_single_event(event_id:int,session: AsyncSession = Depends(get_db)):
    return await event_service.get_single_event(session,event_id)

@event_router.put('/{event_id}/')  #  Protected Route
async def update_event(event_id:int,request : CreateEventRequest,session: AsyncSession = Depends(get_db)):
    return await event_service.update_event(session,event_id,request)

@event_router.patch('/{event_id}/upload-video-url')  #  Protected Route
async def upload_video_url(event_id:int,video_url : AnyUrl,session: AsyncSession = Depends(get_db)):
    return await event_service.upload_video_url(session,event_id,video_url)

@event_router.patch('/{event_id}/status')  #  Protected Route
async def change_status(event_id:int,status : Status = Query(default='PUBLISHED'),session: AsyncSession = Depends(get_db) ):
    return await event_service.change_status(session,event_id,status)

@event_router.delete('/{event_id}/')    #  Protected Route
async def delete_event(event_id:int,session: AsyncSession = Depends(get_db)):
    return await event_service.delete_event(session,event_id)

