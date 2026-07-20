from exceptions.event import InvalidFormat , EventNotFoundError, EventCannotBeCompletedError
from models.event import Event, Status
from repositories.event import event_repo
from services.cloudinary_service import cloudinary_service
from core.redis import redis_client
from schemas.registration import RegistrationResponse
from schemas.event import *
import json
from core.redis import redis_client
import math
from datetime import datetime, timezone

class EventService:
    def _format_event(self, event):

        if not event: 
            return None
        
        return {
            "id" : event.id,
            "title": event.title,
            "description": event.description,
            "speaker_name": event.speaker_name,
            "meeting_link": str(event.meeting_link),
            "event_date_time": str(event.event_date_time),
            "status": event.status,
            "created_at": str(event.created_at),
            "updated_at": str(event.updated_at),
            "thumbnail_public_id": event.thumbnail_public_id,
            "thumbnail_url": str(event.thumbnail_url),
            "video_url" : event.video_url
        }

    async def _clear_event_caches(self, event_id=None):
        """Helper to invalidate redis caches for events"""
        if event_id:
            await redis_client.delete(f"event:{event_id}")
        
        # Invalidate paginated lists
        keys = await redis_client.keys("events:list:*")
        if keys:
            await redis_client.delete(*keys)

    async def create_event(self,request, session ):

        event = Event(
            title = request.title,
            description = request.description,
            speaker_name = request.speaker_name,
            meeting_link = str(request.meeting_link),
            event_date_time = request.event_date_time,
            thumbnail_public_id = request.thumbnail_public_id,
            thumbnail_url = str(request.thumbnail_url)
            )

        created_event = await event_repo.create_event(event,session=session)
        await self._clear_event_caches()
        return self._format_event(created_event)

    async def upload_thumbnail(self,thumbnail):

        ALLOWED_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]
        
        if thumbnail.content_type not in ALLOWED_TYPES:  # Allowed types
            raise InvalidFormat()
        
        return await cloudinary_service.upload_image(thumbnail)   # Cloudinary service to upload thumbnail

    async def get_events(self, page, limit, search, status, session):
        cache_key = f"events:list:{page}:{limit}:{search}:{status}"
        cached = await redis_client.get(cache_key)

        if cached:
            print("Cashed Call")
            return json.loads(cached)
            
        result_data = await event_repo.get_events(session, page, limit, search, status)
        events = result_data["items"]
        
        formatted_items = [self._format_event(event) for event in events]
        
        result = {
            "items": formatted_items,
            "pagination": result_data["pagination"]
        }

        await redis_client.set(cache_key, json.dumps(result), ex=3600)
        return result

    async def get_upcoming_events(self,page,limit,search,session):
        return await self.get_events(page, limit, search, Status.PUBLISHED, session)
    
    async def get_completed_events(self,page,limit,search,session):
        return await self.get_events(page, limit, search, Status.COMPLETED, session)
    
    async def get_single_event(self,session,event_id):

        event_detail_key = f"event:{event_id}"
        cached = await redis_client.get(event_detail_key)

        if cached:
            print("Cashed Call")
            return json.loads(cached)

        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()
        
        result = self._format_event(event)
        
        await redis_client.set(event_detail_key,json.dumps(result),ex=3600)

        return result
 
    async def update_event(self,session,event_id,request):

        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        update_data = request.model_dump()
        update_data["thumbnail_url"] = str(update_data["thumbnail_url"])
        update_data["meeting_link"] = str(update_data["meeting_link"])

        event = await event_repo.update_event(session,event_id,update_data) 
        
        await self._clear_event_caches(event_id)

        return self._format_event(event)
    
    async def delete_event(self,session,event_id):
        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        event = await event_repo.delete_event(session,event_id) 
 
        await self._clear_event_caches(event_id)

        return self._format_event(event)
       
    async def upload_video_url(self,session,event_id,video_url):

        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        event = await event_repo.upload_video_url(session,event_id,str(video_url)) 

        await self._clear_event_caches(event_id)

        return self._format_event(event)
       
    async def publish_event(self,session,event_id):
        event = await event_repo.publish_event(session,event_id)
        await self._clear_event_caches(event_id)
        return self._format_event(event)

    async def complete_event(self,session,event_id):
        event = await event_repo.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()

        if event.status != Status.PUBLISHED:
            raise EventCannotBeCompletedError("Only published events can be marked completed.")

        if event.event_date_time and event.event_date_time > datetime.now(timezone.utc):
            raise EventCannotBeCompletedError("Only events that have already ended can be marked completed.")

        updated_event = await event_repo.complete_event(session,event_id)
        await self._clear_event_caches(event_id)
        return self._format_event(updated_event)

    async def list_registrations(self,event_id,page,limit,session):
        event = await self.get_single_event(session,event_id)

        all_registrations = await event_repo.get_all_registrations_by_event_id(event_id,session)

        if event is None:
            raise EventNotFoundError()

        registrations = await event_repo.list_registrations(event_id,page,limit,session)
        
        response = [
            RegistrationResponse.model_validate(registration)
            for registration in registrations
            ]
        
        return {"items" : response,"pagination" : {"page" : page, "limit" : limit,"total_items" : len(all_registrations),"total_pages" : math.ceil((len(all_registrations)/limit)),"has_next" : bool((len(all_registrations) - page*limit) >= 1),"has_previous" : bool(page > 1)}}  
   
    async def get_events_requiring_reminder(self,session):
        return await event_repo.get_events_requiring_reminder(session)
    
    async def event_analytics(self,event_id,session):

        event = await event_repo.get_single_event(session,event_id)

        if event is None:
            raise EventNotFoundError()

        registrations = await event_repo.get_all_registrations_by_event_id(event_id,session)
        
        registration_count = len(registrations) if len(registrations) > 0 else 0
        
        return EventAnalytics(
                registrations=registration_count,
                status=event.status
            ).model_dump()
       
event_service = EventService()       
