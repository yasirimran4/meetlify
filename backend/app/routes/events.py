
from fastapi import APIRouter , Depends , UploadFile , File
from core.dependency import get_db ,get_admin
from sqlalchemy.ext.asyncio import AsyncSession
from services.event import EventService
from models.user import User
from schemas.event import CreateEventRequest

event_router = APIRouter(prefix='/api/v1/events' ,tags=["Events"])

event_service = EventService()

@event_router.post('/')
async def create_event(request : CreateEventRequest,session: AsyncSession = Depends(get_db),admin : User = Depends(get_admin)):
    print(admin)
    return await event_service.create_event(request,session)

@event_router.post('/upload-thumbnail')
async def upload_thumbnail(thumbnail : UploadFile = File(...),session: AsyncSession = Depends(get_db),admin : User = Depends(get_admin)):
    return await event_service.upload_thumbnail(thumbnail,session)

# @event_router.get('/')
# async def get_all_events(session: AsyncSession = Depends(get_db)):
#     return await event_service.get_all_events_service(session)

# @event_router.get('/{event_id}/')
# async def get_single_event(event_id:int,session: AsyncSession = Depends(get_db)):
#     return await event_service.get_all_events_service(session)

# @event_router.put('/{event_id}/')
# async def update_event(event_id:int):
#     return event_id

# @event_router.patch('/{event_id}/publish')
# async def publish_event(event_id:int):
#     return event_id

# @event_router.patch('/{event_id}/status')
# async def change_status(event_id:int):
#     return event_id

# @event_router.patch('/{event_id}/cancel/')
# async def cancel_event(event_id:int):
#     return event_id

# @event_router.delete('/{event_id}/')
# async def delete_event(event_id:int):
#     return event_id

