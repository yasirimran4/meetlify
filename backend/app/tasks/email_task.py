
from core.celery_app import celery_app
from pydantic import EmailStr

@celery_app.task
def send_email(email:EmailStr):
    print(f"Email send to {email}")
