# import asyncio
# import logging

# from core.celery_app import celery_app
# from services.reminder_service import reminder_service

# logger = logging.getLogger(__name__)


# @celery_app.task(bind=True, name="tasks.check_upcoming_events_task.check_upcoming_events", max_retries=3)
# def check_upcoming_events(self):
#     try:
#         asyncio.run(reminder_service.send_reminder_emails())
#     except Exception as exc:
#         logger.exception("Failed to dispatch reminder emails")
#         raise self.retry(exc=exc, countdown=60) from exc

#  Using n8n email service for now Date : 19-July-2026