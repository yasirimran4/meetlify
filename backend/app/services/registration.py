from exceptions.event import EventNotFoundError
from tasks.email_task import send_registration_email
from models.registration import Registration
from repositories.registration import regitration_repo
from services.event import event_service

class RegitrationService:
    async def register_event(self,event_id,payload,session):
        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        registration = Registration(
            name = payload.name,
            email = payload.email,
            current_role = payload.current_role,
            organization = payload.organization,
            semester = payload.semester,
            event_id = event_id
        ) 

        registration_response = await regitration_repo.register_event(registration,session)

        send_registration_email.delay(email=registration.email,name=registration.name,event_title=event.title,meeting_link=event.meeting_link,speaker_name=event.speaker_name,event_date_time=event.event_date_time)

        return registration_response

    async def list_registrations(self,event_id,session):
        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        return await regitration_repo.list_registrations(event_id,session)

registration_service = RegitrationService()
