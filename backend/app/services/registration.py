from exceptions.event import EventNotFoundError
from tasks.email_task import send_registration_email
from models.registration import Registration
from repositories.registration import regitration_repo
from services.event import event_service
from core.redis import redis_client
from fastapi import HTTPException


class RegitrationService:
    async def register_event(self,event_id,request,session):   # Rate limit

        rate_limit_key = f"rate_limit:register:{request.email}"

        count = redis_client.incr(rate_limit_key)

        if count == 1:
            redis_client.expire(rate_limit_key,3600)

        if count > 5:
            if count > 5:
                raise HTTPException(status_code=429,detail="Too many request. Try Again Later")    

        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        registration = Registration(
            name = request.name,
            email = request.email,
            current_role = request.current_role,
            organization = request.organization,
            semester = request.semester,
            event_id = event_id
        ) 

        registration_response = await regitration_repo.register_event(registration,session)

        send_registration_email.delay(
            email=registration.email,
            name=registration.name,event_title=event.title,
            meeting_link=event.meeting_link,speaker_name=event.speaker_name,
            event_date_time=event.event_date_time
            )

        return registration_response

    async def list_registrations(self,event_id,session):
        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        return await regitration_repo.list_registrations(event_id,session)
    
    async def pending_registrations_reminder(self,event_id,session):
        return await regitration_repo.pending_registrations_reminder(event_id=event_id,session=session)

    async def mark_reminder_sent(self,registration_id,session):
        return await regitration_repo.mark_reminder_sent(registration_id,session=session)      
                 
registration_service = RegitrationService()
