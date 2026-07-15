# Admin Routes protected . A separet admin panel in frontend

from fastapi import APIRouter , Depends, UploadFile , File  , Query
from core.dependency import get_db , get_admin
from models.user import User
from models.event import Status
from sqlalchemy.ext.asyncio import AsyncSession
from services.event import event_service
from services.registration import registration_service
from schemas.event import *
from schemas.registration import *
from pydantic import AnyUrl
from utils.success_response import success_response

admin_router = APIRouter(prefix='/api/v1/admin/events' ,tags=["Admin Events"])
admin_registrations_router = APIRouter(prefix='/api/v1/admin/registrations' ,tags=["Admin Registrations"])

@admin_registrations_router.get('', response_model=GlobalRegistrationList)
async def get_all_registrations_global(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, le=100),
    search: str = Query(default=None, max_length=100),
    event_id: int = Query(default=None),
    status: str = Query(default=None),
    session: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin)
):
    registrations = await registration_service.list_all_registrations(page, limit, search, event_id, status, session)
    return success_response(
        data=registrations,
        message="Registrations Returned Successfully",
        status_code=200
    )

@admin_router.get('')
async def get_all_events(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, le=100),
    search: str = Query(default=None, max_length=100),
    status: Status = Query(default=None),
    session: AsyncSession = Depends(get_db),
    admin: User = Depends(get_admin)
):
    events = await event_service.get_events(page, limit, search, status, session)
    return success_response(
        data=events,
        message="Events Returned Successfully",
        status_code=200
    )

@admin_router.get('/dashboard',response_model = DashboardResponse )    # Protected Route
async def dashboard(session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    dashboard_data =  await registration_service.dashboard(session)
    return success_response(
        data=dashboard_data,
        message="Dashboard returned Successfully",
        status_code=200
    )


@admin_router.post('/upload-thumbnail')  #  Protected Route
async def upload_thumbnail(thumbnail : UploadFile = File(...),admin:User = Depends(get_admin)):
    response =  await event_service.upload_thumbnail(thumbnail)
    return success_response(
        data=response,
        message="Thumbnail Uploaded Successfully",
        status_code=200
    )

@admin_router.post('')     #  Protected Route
async def create_event(request : CreateEventRequest,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    event =  await event_service.create_event(request,session)
    return success_response(
        data=event,
        message="Event Created Successfully",
        status_code=201
    )


@admin_router.put('/{event_id}')  #  Protected Route
async def update_event(event_id:int,request : CreateEventRequest,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    event =  await event_service.update_event(session,event_id,request)
    return success_response(
        data=event,
        message="Event Updated Successfully",
        status_code=200
    )

@admin_router.delete('/{event_id}')    #  Protected Route
async def delete_event(event_id:int,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    event =  await event_service.delete_event(session,event_id)
    return success_response(
        data=event,
        message="Event Deleted Successfully",
        status_code=200
    )

@admin_router.patch('/{event_id}/upload-video-url')  #  Protected Route
async def upload_video_url(event_id:int,video_url : AnyUrl,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    response =  await event_service.upload_video_url(session,event_id,video_url)
    return success_response(
        data=response,
        message="Video URl Uploaded Successfully",
        status_code=200
    )

@admin_router.patch('/{event_id}/publish')  #  Protected Route
async def publish_event(event_id:int,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    event =  await event_service.publish_event(session,event_id)
    return success_response(
        data=event,
        message="Event Published Successfully",
        status_code=200
    )

@admin_router.patch('/{event_id}/complete')  #  Protected Route
async def complete_event(event_id:int,session: AsyncSession = Depends(get_db),admin:User = Depends(get_admin)):
    event = await event_service.complete_event(session,event_id)
    return success_response(
        data=event,
        message="Event marked as completed successfully",
        status_code=200
    )

@admin_router.get('/{event_id}/registrations',response_model = RegistrationList )    # Protected Route
async def list_registrations(event_id : int,session: AsyncSession = Depends(get_db),page : int = Query(default=1, ge=1),limit : int = Query(default=10, le=100),admin:User = Depends(get_admin)):
    registrations =  await event_service.list_registrations(event_id,page,limit,session)
    return success_response(
        data=registrations,
        message="Registrations retuned Successfully",
        status_code=200
    )

@admin_router.get('/{event_id}/analytics',response_model=EventAnalytics)   
async def event_analytics(event_id :int ,session: AsyncSession = Depends(get_db)):
    analytics =  await event_service.event_analytics(event_id,session)
    return success_response(
        data=analytics,
        message="Analytics Retuned Successfully",
        status_code=200
    )

