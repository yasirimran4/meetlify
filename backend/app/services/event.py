from repositories.event import EventRepository
from exceptions.event import InvalidFomrat , EventNotFoundError
from services.cloudinary_service import CloudinaryService
from models.event import Event 
from models.registration import Registration

event_repo = EventRepository()   # object to interact with db
cloud_service = CloudinaryService()

class EventService:
    async def create_event(self,payload, session ):
        event = Event(
            title = payload.title,
            description = payload.description,
            speaker_name = payload.speaker_name,
            meeting_link = str(payload.meeting_link),
            deadline = payload.deadline,
            event_date_time = payload.event_date_time,
            thumbnail_public_id = payload.thumbnail_public_id,
            thumbnail_url = str(payload.thumbnail_url)
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
        
        return await cloud_service.upload_image(thumbnail)   # Cloudinary service to upload thumbnail

    async def get_upcoming_events(self,page,limit,search,session):
        return await event_repo.get_upcoming_events(page,limit,search,session)
    
    async def get_events_requiring_reminder(self,session):
        return await event_repo.get_events_requiring_reminder(session)
    
    async def get_past_events(self,page,limit,search,session):
        return await event_repo.get_past_events(page,limit,search,session)
    
    async def get_single_event(self,session,event_id):
        event = await event_repo.get_single_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        return event
    
    async def update_event(self,session,event_id,payload):
        update_data = payload.model_dump()
        update_data["thumbnail_url"] = str(update_data["thumbnail_url"])
        update_data["meeting_link"] = str(update_data["meeting_link"])
        event = await event_repo.update_event(session,event_id,update_data) 

        if event is None:
            raise EventNotFoundError()

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
        event = await event_repo.delete_event(session,event_id) 

        if event is None:
            raise EventNotFoundError()

        return event
       
event_service = EventService()       