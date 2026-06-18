from celery import Celery
from .config import settings

celery_app = Celery("meetlify" ,broker=settings.REDIS_URL,backend=settings.REDIS_URL)

celery_app.autodiscover_tasks(["tasks"])