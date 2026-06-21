
from core.celery_app import celery_app
from services.email_service import email_service
import asyncio
from services.template_service import render_template

@celery_app.task
def send_registration_email(email:str,name:str,event_title:str,meeting_link,speaker_name:str,event_date_time):
    formatted_date = event_date_time.strftime(
    "%d %B %Y, %I:%M %p"
    )
    html = render_template("templates/emails/registration.html",{"attendee_name" : name,"event_title" : event_title,"meeting_link":meeting_link,"speaker_name":speaker_name,"event_date" : formatted_date})
    subject = f"Registration Confirmation for {event_title}"
    asyncio.run(email_service.send_email(email,subject=subject,body=html))   # Celery is sync but email service is Async
