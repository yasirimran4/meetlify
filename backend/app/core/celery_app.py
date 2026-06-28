from celery import Celery
from .config import settings
celery_app = Celery("meetlify" ,broker=settings.REDIS_URL,backend=settings.REDIS_URL)

celery_app.conf.imports = [
    "tasks.email_task",
    "tasks.reminder_task",
    "tasks.check_upcoming_events_task",
]

celery_app.conf.beat_schedule = {
    "check-event-reminders": {
        "task": "tasks.check_upcoming_events_task.check_upcoming_events",
        "schedule": 60.0,
    },
      "check-event-date": {
        "task": "tasks.complete_event.complete_event",
        "schedule": 60.0,
    },
}