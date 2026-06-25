from exceptions.event import InvalidFomrat , EventNotFoundError
from models.event import Event 
from repositories.event import event_repo
from services.cloudinary_service import cloudinary_service
from core.redis import redis_client
import json
from schemas.event import EventResponse

class EventService:
    async def create_event(self,request, session ):

        event = Event(
            title = request.title,
            description = request.description,
            speaker_name = request.speaker_name,
            meeting_link = str(request.meeting_link),
            deadline = request.deadline,
            event_date_time = request.event_date_time,
            thumbnail_public_id = request.thumbnail_public_id,
            thumbnail_url = str(request.thumbnail_url)
            )
        
        return await event_repo.create_event(event,session=session)

    async def upload_thumbnail(self,thumbnail):

        ALLOWED_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]
        
        if thumbnail.content_type not in ALLOWED_TYPES:  # Allowed types
            raise InvalidFomrat()
        
        return await cloudinary_service.upload_image(thumbnail)   # Cloudinary service to upload thumbnail

    async def get_upcoming_events(self,page,limit,search,session):

        cached = redis_client.get("events:upcoming")

        if cached:
            print("Cashed Call")
            return json.loads(cached)
        
        events = await event_repo.get_upcoming_events(page,limit,search,session)
        result = [
            {
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
            for event in events
        ]

        redis_client.set("events:upcoming",json.dumps(result),ex=3600)

        return events
    
    async def get_completed_events(self,page,limit,search,session):

        cached = redis_client.get("events:completed")

        if cached:
            print("Cashed Call")
            return json.loads(cached)
        
        events = await event_repo.get_completed_events(page,limit,search,session)
        result = [
            {
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
            for event in events
        ]

        redis_client.set("events:completed",json.dumps(result),ex=3600)

        return events
    
    async def get_single_event(self,session,event_id):

        event_detail_key = f"event:{event_id}"
        cached = redis_client.get(event_detail_key)

        if cached:
            print("Cashed Call")
            return json.loads(cached)

        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()
        
        result = {
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
        
        redis_client.set(event_detail_key,json.dumps(result),ex=3600)

        return event
 
    async def update_event(self,session,event_id,request):

        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        update_data = request.model_dump()
        update_data["thumbnail_url"] = str(update_data["thumbnail_url"])
        update_data["meeting_link"] = str(update_data["meeting_link"])

        event = await event_repo.update_event(session,event_id,update_data) 
        
        redis_client.delete("events:upcoming")
        redis_client.delete("events:completed")
        redis_client.delete(f"event:{event_id}")

        return event
    
    async def change_status(self,session,event_id,status):

        event = await event_repo.change_status(session,event_id,status) 

        if event is None:
            raise EventNotFoundError()

        return {"status":status}
    
    async def upload_video_url(self,session,event_id,video_url):

        event = await event_repo.upload_video_url(session,event_id,video_url) 

        if event is None:
            raise EventNotFoundError()

        return {"status":video_url}
    
    async def delete_event(self,session,event_id):
        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        event = await event_repo.delete_event(session,event_id) 
 
        redis_client.delete("events:upcoming")
        redis_client.delete("events:completed")
        redis_client.delete(f"event:{event_id}")

        return event
       
       
    async def get_events_requiring_reminder(self,session):
        return await event_repo.get_events_requiring_reminder(session)
       
event_service = EventService()       