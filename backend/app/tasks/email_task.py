
from core.celery_app import celery_app
from services.email_service import email_service
import asyncio
from services.template_service import render_template
from services.reminder_service import reminder_service
@celery_app.task(
    bind=True,
    max_retries=3
)
def send_registration_email(self,email:str,name:str,event_title:str,meeting_link,speaker_name:str,event_date_time):
    formatted_date = event_date_time.strftime(
    "%d %B %Y, %I:%M %p"
    )
    html = render_template("templates/emails/registration.html",{"attendee_name" : name,"event_title" : event_title,"meeting_link":meeting_link,"speaker_name":speaker_name,"event_date" : formatted_date})
    subject = f"Registration Confirmation for {event_title}"

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

@celery_app.task(
    bind=True,
    max_retries=3
)
def check_upcoming_events(self):
    try:
        asyncio.run(
            reminder_service.send_reminder_emails()
        )

    except Exception as e:
        raise self.retry(exc=e,countdown=60)