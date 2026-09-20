from uuid import UUID

from exceptions.event import EventNotFoundError
from models.registration import Registration
from repositories.registration import regitration_repo
from repositories.event import event_repo
from core.redis import redis_client
from exceptions.registration import *
from fastapi import HTTPException
from schemas.registration import GlobalRegistrationResponse
from utils.public_id import serialize_public_id


class RegitrationService:
    async def register_event(self, event_public_id: UUID, request, session):
        rate_limit_key = f"rate_limit:register:{request.email}"

        count = await redis_client.incr(rate_limit_key)

        if count == 1:
            await redis_client.expire(rate_limit_key, 300)

        if count > 5:
            raise HTTPException(status_code=429, detail="Too many request. Try Again Later")

        event = await event_repo.get_event_by_public_id(session, event_public_id)
        if event is None:
            raise EventNotFoundError()

        existing_registration = await regitration_repo.get_registration_by_email(
            event.id,
            email=request.email,
            session=session,
        )

        if existing_registration:
            raise DuplicateRegistrationError()

        registration = Registration(
            name=request.name,
            email=request.email,
            current_role=request.current_role,
            organization=request.organization,
            semester=request.semester,
            event_id=event.id,
        )

        registration_response = await regitration_repo.register_event(registration, session)

        return {
            "id": serialize_public_id(registration_response.public_id),
            "name": registration_response.name,
            "email": registration_response.email,
            "current_role": registration_response.current_role,
            "organization": registration_response.organization,
            "semester": registration_response.semester,
            "reminder_sent": registration_response.reminder_sent,
            "event_id": serialize_public_id(event.public_id),
            "created_at": registration_response.created_at.isoformat()
            if registration_response.created_at
            else None,
        }

    async def dashboard(self, session):
        total_registrations = await regitration_repo.get_registrations_count(session)
        upcoming_events = await event_repo.upcoming_events_count(session=session)
        completed_events = await event_repo.completed_events_count(session=session)

        return {
            "total_events": upcoming_events + completed_events,
            "upcoming_events": upcoming_events,
            "completed_events": completed_events,
            "total_registrations": total_registrations,
        }

    async def list_all_registrations(self, page, limit, search, event_public_id, status, session):
        internal_event_id = None
        if event_public_id:
            event = await event_repo.get_event_by_public_id(session, event_public_id)
            if event is None:
                raise EventNotFoundError()
            internal_event_id = event.id

        registrations_data = await regitration_repo.get_all_registrations_global(
            page,
            limit,
            search,
            internal_event_id,
            status,
            session,
        )

        response = [GlobalRegistrationResponse(**item) for item in registrations_data["items"]]

        return {
            "items": response,
            "pagination": registrations_data["pagination"],
        }

    async def pending_registrations_reminder(self, event_id, session):
        return await regitration_repo.pending_registrations_reminder(event_id=event_id, session=session)

    async def mark_reminder_sent(self, registration_id, session):
        return await regitration_repo.mark_reminder_sent(registration_id, session=session)


registration_service = RegitrationService()
