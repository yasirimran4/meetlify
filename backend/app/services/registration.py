from repositories.registration import RegitrationRepository
from .event import EventService
from exceptions.event import EventNotFoundError
regitration_repo = RegitrationRepository()
event_service = EventService()
from models.registration import Registration

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
        
        return await regitration_repo.register_event(registration,session)

    async def list_registrations(self,event_id,session):
        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        return await regitration_repo.list_registrations(event_id,session)
