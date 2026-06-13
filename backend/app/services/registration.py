from repositories.registration import RegitrationRepository
from .event import EventService
from exceptions.event import EventNotFoundError
regitration_repo = RegitrationRepository()
event_service = EventService()

class RegitrationService:
    async def register_event(self,event_id,payload,session):
        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        payload = payload.model_dump()
        return await regitration_repo.register_event(event_id,payload,session)

    async def list_registrations(self,event_id,session):
        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        return await regitration_repo.list_registrations(event_id,session)
