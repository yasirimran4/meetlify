import logging

from core.database import SessionLocal
from repositories.registration import regitration_repo
from services.event import event_service
from tasks.reminder_task import send_reminder_email

logger = logging.getLogger(__name__)


class ReminderService:
    async def send_reminder_emails(self):
        if SessionLocal is None:
            raise RuntimeError("DATABASE_URL is not configured")

        async with SessionLocal() as session:
            events = await event_service.get_events_requiring_reminder(session=session)
            if not events:
                return

            for event in events:
                registrations = await regitration_repo.pending_registrations_reminder(event_id=event.id, session=session)
                if not registrations:
                    continue

                for registration in registrations:
                    send_reminder_email.delay(
                        email=registration.email,
                        name=registration.name,
                        event_title=event.title,
                        meeting_link=event.meeting_link,
                    )
                    await regitration_repo.mark_reminder_sent(registration.id, session)


reminder_service = ReminderService()

