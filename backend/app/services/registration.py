from exceptions.event import EventNotFoundError
from tasks.email_task import send_registration_email
from models.registration import Registration
from repositories.registration import regitration_repo
from .event import event_service
from repositories.event import event_repo
from core.redis import redis_client
from exceptions.registration import *
from fastapi import HTTPException


class RegitrationService:
    async def register_event(self,event_id,request,session):   # Rate limit

        rate_limit_key = f"rate_limit:register:{request.email}"

        count = await redis_client.incr(rate_limit_key)

        if count == 1:
            await redis_client.expire(rate_limit_key,300)

        if count > 5:
            if count > 5:
                raise HTTPException(status_code=429,detail="Too many request. Try Again Later")    

        event = await event_service.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()
        
        existing_registration = await regitration_repo.get_registration_by_email(event_id,email=request.email,session=session)
        
        if existing_registration:
            raise DuplicateRegistrationError()
        
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
            name=registration.name,
            event_title=event.title,
            meeting_link=event.meeting_link,speaker_name=event.speaker_name,
            event_date_time=event.event_date_time
        )

        return registration_response
    
    async def dashboard(self,session):
        total_registrations = await regitration_repo.get_registrations_count(session) 
        upcoming_events = await event_repo.upcoming_events_count(session=session)
        completed_events = await event_repo.completed_events_count(session=session)

        return {"total_events" : upcoming_events + completed_events, "upcoming_events" : upcoming_events,"completed_events": completed_events,"total_registrations":total_registrations}

    
    async def pending_registrations_reminder(self,event_id,session):
        return await regitration_repo.pending_registrations_reminder(event_id=event_id,session=session)

    async def mark_reminder_sent(self,registration_id,session):
        return await regitration_repo.mark_reminder_sent(registration_id,session=session)      
 
registration_service = RegitrationService()