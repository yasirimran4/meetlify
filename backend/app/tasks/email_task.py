import asyncio
import logging
from datetime import datetime

from core.celery_app import celery_app
from services.email_service import email_service
from services.template_service import render_template

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, name="tasks.email_task.send_registration_email", max_retries=3)
def send_registration_email(self, email: str, name: str, event_title: str, meeting_link, speaker_name: str, event_date_time):
    event_datetime = event_date_time
    if isinstance(event_datetime, str):
        event_datetime = datetime.fromisoformat(event_datetime)

    formatted_date = event_datetime.strftime("%d %B %Y, %I:%M %p")
    html = render_template(
        "templates/emails/registration.html",
        {
            "attendee_name": name,
            "event_title": event_title,
            "meeting_link": meeting_link,
            "speaker_name": speaker_name,
            "event_date": formatted_date,
        },
    )
    subject = f"Registration Confirmation for {event_title}"

    try:
        asyncio.run(
            email_service.send_email(
                email_to=email,
                subject=subject,
                body=html,
            )
        )

    except Exception as exc:
        logger.exception("Failed to send registration email")
        raise self.retry(exc=exc, countdown=60) from exc


