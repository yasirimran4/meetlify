
from core.celery_app import celery_app


@celery_app.task
def send_email(email:str):
    print(f"Email send to {email}")
