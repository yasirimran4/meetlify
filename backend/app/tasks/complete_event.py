from core.celery_app import celery_app
from repositories.event import event_repo
from core.database import SessionLocal
from core.dependency import get_db

import asyncio
async def get_completed_events_for_changing_status():
    async with SessionLocal() as session:
        completed_events = await event_repo.get_completed_events_for_changing_status(session)
    return completed_events

@celery_app.task(
    bind=True,
    max_retries=3
)
def complete_event():
    events = asyncio.run(get_completed_events_for_changing_status())
    if events is not None:
        session = get_db()
        for event in events:
            asyncio.run(event_repo.mark_completed(event_id=event.id,session=session))
        
