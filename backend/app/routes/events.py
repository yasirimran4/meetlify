
from fastapi import APIRouter , Depends
from services.event import create_event_service , get_all_events_service
from core.dependency import get_db
from sqlalchemy.ext.asyncio import AsyncSession

event_router = APIRouter(prefix='/api/v1/events' ,tags=["Events"])


@event_router.post('/')
async def create_event(session: AsyncSession = Depends(get_db)):
    return await create_event_service(session)

@event_router.get('/')
async def get_all_events(session: AsyncSession = Depends(get_db)):
    return await get_all_events_service(session)

@event_router.get('/{event_id}/')
async def get_single_event(event_id:int,session: AsyncSession = Depends(get_db)):
    return await get_all_events_service(session)

@event_router.put('/{event_id}/')
async def update_event(event_id:int):
    return event_id


@event_router.patch('/{event_id}/publish')
async def publish_event(event_id:int):
    return event_id

@event_router.patch('/{event_id}/cancel/')
async def cancel_event(event_id:int):
    return event_id

@event_router.delete('/{event_id}/')
async def delete_event(event_id:int):
    return event_id
