    

from core.celery_app import celery_app
from services.email_service import email_service
import asyncio
from services.template_service import render_template


@celery_app.task(
    bind=True,
    max_retries=3
)
def send_reminder_email(self,email:str,name:str,event_title:str,meeting_link):

    html = render_template("templates/emails/reminder.html",{"attendee_name" : name,"event_title" : event_title,"meeting_link":meeting_link})
    subject = f"Reminder for {event_title} | Start in one Hour"

    try:
        asyncio.run(
            email_service.send_email(
                email_to=email,
                subject=subject,      # Celery is sync but email service is Async
                body=html
            )
        )

    except Exception as e:
        raise self.retry(exc=e,countdown=60)

