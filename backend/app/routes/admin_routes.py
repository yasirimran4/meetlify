
from fastapi import APIRouter , Depends, UploadFile , File  , Query
from core.dependency import get_db , get_admin
from models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from services.event import event_service
from services.registration import registration_service
from schemas.event import *
from schemas.registration import *
from pydantic import AnyUrl


admin_router = APIRouter(prefix='/api/v1/admin/events' ,tags=["Admin"])

@admin_router.post('/upload-thumbnail')  #  Protected Route
async def upload_thumbnail(thumbnail : UploadFile = File(...),admin:User = Depends(get_admin)):
    return await event_service.upload_thumbnail(thumbnail)

@admin_router.post('/')     #  Protected Route
async def create_event(request : CreateEventRequest,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await event_service.create_event(request,session)


@admin_router.put('/{event_id}')  #  Protected Route
async def update_event(event_id:int,request : CreateEventRequest,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await event_service.update_event(session,event_id,request)

@admin_router.delete('/{event_id}')    #  Protected Route
async def delete_event(event_id:int,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await event_service.delete_event(session,event_id)

@admin_router.patch('/{event_id}/upload-video-url')  #  Protected Route
async def upload_video_url(event_id:int,video_url : AnyUrl,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await event_service.upload_video_url(session,event_id,video_url)

@admin_router.patch('/{event_id}/publish')  #  Protected Route
async def publish_event(event_id:int,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await event_service.publish_event(session,event_id)

@admin_router.get('/{event_id}/registrations',response_model = RegistrationList )    # Protected Route
async def list_registrations(event_id : int,session: AsyncSession = Depends(get_db),page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),admin:User = Depends(get_admin)):
    return await event_service.list_registrations(event_id,page,limit,session)

@admin_router.get('/dashboard',response_model = DashboardResponse )    # Protected Route
async def dashboard(session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    return await registration_service.dashboard(session)

