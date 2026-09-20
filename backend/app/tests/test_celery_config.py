# from core.celery_app import celery_app


# def test_celery_beat_schedule_uses_task_names():
#     schedule = celery_app.conf.beat_schedule
#     assert schedule["check-event-reminders"]["task"] == "tasks.check_upcoming_events_task.check_upcoming_events"
#     assert schedule["check-event-date"]["task"] == "tasks.complete_event.complete_expired_events"
