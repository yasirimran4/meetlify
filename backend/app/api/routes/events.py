
from fastapi import APIRouter
event_router = APIRouter(prefix='/v1/api/events' ,tags=["Events"])


@event_router.put('/update-event/{event_id}/')
async def update_event(event_id:int):
    return event_id
@event_router.patch('/publish-event{event_id}/')
async def publish_event(event_id:int):
    return event_id

@event_router.delete('/delete-event/{event_id}/')
async def delete_event(event_id:int):
    return event_id