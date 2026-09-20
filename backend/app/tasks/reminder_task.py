# import asyncio
# import logging

# from core.celery_app import celery_app
# from services.email_service import email_service
# from services.template_service import render_template

# logger = logging.getLogger(__name__)


# @celery_app.task(bind=True, name="tasks.reminder_task.send_reminder_email", max_retries=3)
# def send_reminder_email(self, email: str, name: str, event_title: str, meeting_link):
#     html = render_template(
#         "templates/emails/reminder.html",
#         {"attendee_name": name, "event_title": event_title, "meeting_link": meeting_link},
#     )
#     subject = f"Reminder for {event_title} | Start in one Hour"

#     try:
#         asyncio.run(
#             email_service.send_email(
#                 email_to=email,
#                 subject=subject,
#                 body=html,
#             )
#         )
#     except Exception as exc:
#         logger.exception("Failed to send reminder email")
#         raise self.retry(exc=exc, countdown=60) from exc

#  Using n8n email service for now Date : 19-July-2026
