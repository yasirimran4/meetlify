from core.celery_app import celery_app
from repositories.event import event_repo
from core.database import SessionLocal

import asyncio

async def complete_events():
    async with SessionLocal() as session:
        await event_repo.complete_expired_events(session=session)

@celery_app.task(
    bind=True,
    max_retries=3
)
def complete_expired_events(self):
    print("Complete Event Called")
    asyncio.run(complete_events())

   
