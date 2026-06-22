from .event import event_service
from .registration import registration_service
from core.database import SessionLocal
from tasks.email_task import send_reminder_email

class ReminderService:
    async def send_reminder_emails(self):
        async with SessionLocal() as session: 
            events = await event_service.get_events_requiring_reminder(session=session)
            
            if events is not None:
                for event in events:
                    registrations = await registration_service.pending_registrations_reminder(event_id=event.id,session=session)
                    if registrations is not None:
                        for registration in registrations:
                            send_reminder_email.delay(email=registration.email,name=registration.name,event_title=event.title,meeting_link=event.meeting_link)
                            await registration_service.mark_reminder_sent(registration.id,session)

 

reminder_service = ReminderService()

