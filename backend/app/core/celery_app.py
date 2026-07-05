from celery import Celery

from .config import settings


def get_celery_url(url: str) -> str:
    if url and url.startswith("rediss://") and "ssl_cert_reqs=" not in url:
        separator = "&" if "?" in url else "?"
        return f"{url}{separator}ssl_cert_reqs=CERT_NONE"
    return url


celery_url = get_celery_url(settings.REDIS_URL or "redis://localhost:6379/0")
celery_app = Celery("meetlify", broker=celery_url, backend=celery_url)

celery_app.conf.update(
    imports=[
        "tasks.email_task",
        "tasks.reminder_task",
        "tasks.check_upcoming_events_task",
        "tasks.complete_event",
    ],
    beat_schedule={
        "check-event-reminders": {
            "task": "tasks.check_upcoming_events_task.check_upcoming_events",
            "schedule": 60.0,
        },
        "check-event-date": {
            "task": "tasks.complete_event.complete_expired_events",
            "schedule": 60.0,
        },
    },
    broker_connection_retry_on_startup=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,
)
