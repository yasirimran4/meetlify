
from core.celery_app import celery_app
from services.email_service import email_service
import asyncio

@celery_app.task
def send_email(email:str,subject:str,body:str):
    asyncio.run(email_service.send_email(email,subject,body))   # Celery is sync but email service is Async
