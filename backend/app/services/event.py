from uuid import UUID

from exceptions.event import InvalidFormat, EventNotFoundError, EventCannotBeCompletedError
from models.event import Event, Status
from repositories.event import event_repo
from services.cloudinary_service import cloudinary_service
from core.redis import redis_client
from schemas.event import *
from utils.public_id import serialize_public_id
import json
import math
from datetime import datetime, timezone


class EventService:
    def _normalize_name_list(self, value):
        if value is None:
            return []
        if isinstance(value, str):
            value = [value]
        cleaned = []
        for item in value:
            if item is None:
                continue
            name = str(item).strip()
            if name:
                cleaned.append(name)
        return cleaned

    def _format_event(self, event):
        if not event:
            return None

        speakers = self._normalize_name_list(getattr(event, "speakers", None))
        if not speakers and getattr(event, "speaker_name", None):
            speakers = [str(event.speaker_name).strip()]

        organizers = self._normalize_name_list(getattr(event, "organizers", None))
        if not organizers:
            organizers = ["Dr. Zobia Suhail"]

        return {
            "id": serialize_public_id(event.public_id),
            "title": event.title,
            "description": event.description,
            "speaker_name": speakers[0] if speakers else "",
            "speakers": speakers,
            "organizers": organizers,
            "meeting_link": str(event.meeting_link),
            "event_date_time": str(event.event_date_time),
            "status": event.status,
            "created_at": str(event.created_at),
            "updated_at": str(event.updated_at),
            "thumbnail_public_id": event.thumbnail_public_id,
            "thumbnail_url": str(event.thumbnail_url),
            "video_url": event.video_url,
        }

    def _format_registration(self, registration):
        return {
            "id": serialize_public_id(registration.public_id),
            "name": registration.name,
            "email": registration.email,
            "current_role": registration.current_role,
            "organization": registration.organization,
            "semester": registration.semester,
            "reminder_sent": registration.reminder_sent,
            "created_at": registration.created_at,
        }

    async def _get_event_entity(self, session, event_public_id: UUID):
        event = await event_repo.get_event_by_public_id(session, event_public_id)
        if event is None:
            raise EventNotFoundError()
        return event

    async def _clear_event_caches(self, event_public_id=None):
        if event_public_id:
            await redis_client.delete(f"event:{event_public_id}")

        keys = await redis_client.keys("events:list:*")
        if keys:
            await redis_client.delete(*keys)

    async def create_event(self, request, session):
        speakers = self._normalize_name_list(request.speakers or [request.speaker_name])
        organizers = self._normalize_name_list(request.organizers) or ["Dr. Zobia Suhail"]

        event = Event(
            title=request.title,
            description=request.description,
            speaker_name=speakers[0] if speakers else "",
            speakers=speakers,
            organizers=organizers,
            meeting_link=str(request.meeting_link),
            event_date_time=request.event_date_time,
            thumbnail_public_id=request.thumbnail_public_id,
            thumbnail_url=str(request.thumbnail_url),
        )

        created_event = await event_repo.create_event(event, session=session)
        await self._clear_event_caches()
        return self._format_event(created_event)

    async def upload_thumbnail(self, thumbnail):
        ALLOWED_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ]

        if thumbnail.content_type not in ALLOWED_TYPES:
            raise InvalidFormat()

        return await cloudinary_service.upload_image(thumbnail)

    async def get_events(self, page, limit, search, status, session):
        cache_key = f"events:list:{page}:{limit}:{search}:{status}"
        cached = await redis_client.get(cache_key)

        if cached:
            return json.loads(cached)

        result_data = await event_repo.get_events(session, page, limit, search, status)
        events = result_data["items"]

        formatted_items = [self._format_event(event) for event in events]

        result = {
            "items": formatted_items,
            "pagination": result_data["pagination"],
        }

        await redis_client.set(cache_key, json.dumps(result), ex=3600)
        return result

    async def get_upcoming_events(self, page, limit, search, session):
        return await self.get_events(page, limit, search, Status.PUBLISHED, session)

    async def get_completed_events(self, page, limit, search, session):
        return await self.get_events(page, limit, search, Status.COMPLETED, session)

    async def get_single_event(self, session, event_public_id: UUID):
        event_detail_key = f"event:{event_public_id}"
        cached = await redis_client.get(event_detail_key)

        if cached:
            return json.loads(cached)

        event = await self._get_event_entity(session, event_public_id)
        result = self._format_event(event)
        await redis_client.set(event_detail_key, json.dumps(result), ex=3600)
        return result

    async def update_event(self, session, event_public_id: UUID, request):
        event = await self._get_event_entity(session, event_public_id)

        speakers = self._normalize_name_list(request.speakers or [request.speaker_name])
        organizers = self._normalize_name_list(request.organizers) or ["Dr. Zobia Suhail"]

        update_data = request.model_dump()
        update_data["speakers"] = speakers
        update_data["organizers"] = organizers
        update_data["speaker_name"] = speakers[0] if speakers else ""
        update_data["thumbnail_url"] = str(update_data["thumbnail_url"])
        update_data["meeting_link"] = str(update_data["meeting_link"])

        updated_event = await event_repo.update_event(session, event.id, update_data)
        await self._clear_event_caches(event.public_id)
        return self._format_event(updated_event)

    async def delete_event(self, session, event_public_id: UUID):
        event = await self._get_event_entity(session, event_public_id)
        deleted_event = await event_repo.delete_event(session, event.id)
        await self._clear_event_caches(event.public_id)
        return self._format_event(deleted_event)

    async def upload_video_url(self, session, event_public_id: UUID, video_url):
        event = await self._get_event_entity(session, event_public_id)
        updated_event = await event_repo.upload_video_url(session, event.id, str(video_url))
        await self._clear_event_caches(event.public_id)
        return self._format_event(updated_event)

    async def publish_event(self, session, event_public_id: UUID):
        event = await self._get_event_entity(session, event_public_id)
        updated_event = await event_repo.publish_event(session, event.id)
        await self._clear_event_caches(event.public_id)
        return self._format_event(updated_event)

    async def complete_event(self, session, event_public_id: UUID):
        event = await self._get_event_entity(session, event_public_id)

        if event.status != Status.PUBLISHED:
            raise EventCannotBeCompletedError("Only published events can be marked completed.")

        if event.event_date_time and event.event_date_time > datetime.now(timezone.utc):
            raise EventCannotBeCompletedError("Only events that have already ended can be marked completed.")

        updated_event = await event_repo.complete_event(session, event.id)
        await self._clear_event_caches(event.public_id)
        return self._format_event(updated_event)

    async def list_registrations(self, event_public_id: UUID, page, limit, session):
        event = await self._get_event_entity(session, event_public_id)
        all_registrations = await event_repo.get_all_registrations_by_event_id(event.id, session)
        registrations = await event_repo.list_registrations(event.id, page, limit, session)

        response = [self._format_registration(registration) for registration in registrations]

        return {
            "items": response,
            "pagination": {
                "page": page,
                "limit": limit,
                "total_items": len(all_registrations),
                "total_pages": math.ceil(len(all_registrations) / limit) if all_registrations else 0,
                "has_next": bool((len(all_registrations) - page * limit) >= 1),
                "has_previous": bool(page > 1),
            },
        }

    async def get_events_requiring_reminder(self, session):
        return await event_repo.get_events_requiring_reminder(session)

    async def event_analytics(self, event_public_id: UUID, session):
        event = await self._get_event_entity(session, event_public_id)
        registrations = await event_repo.get_all_registrations_by_event_id(event.id, session)
        registration_count = len(registrations) if registrations else 0

        return EventAnalytics(
            registrations=registration_count,
            status=event.status,
        ).model_dump()


event_service = EventService()
