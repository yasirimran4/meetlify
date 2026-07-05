import asyncio
import logging

from core.celery_app import celery_app
from core.database import SessionLocal
from repositories.event import event_repo

logger = logging.getLogger(__name__)


async def complete_events():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured")

    async with SessionLocal() as session:
        await event_repo.complete_expired_events(session=session)


@celery_app.task(bind=True, name="tasks.complete_event.complete_expired_events", max_retries=3)
def complete_expired_events(self):
    try:
        asyncio.run(complete_events())
    except Exception as exc:
        logger.exception("Failed to complete expired events")
        raise self.retry(exc=exc, countdown=60) from exc

