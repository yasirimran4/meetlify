from services.reminder_service import reminder_service
from core.celery_app import celery_app
import asyncio

@celery_app.task(
    bind=True,
    max_retries=3
)
def check_upcoming_events(self):
    try:
        print("Yasir")
        asyncio.run(
            reminder_service.send_reminder_emails()
        )

    except Exception as e:
        raise self.retry(exc=e,countdown=60)