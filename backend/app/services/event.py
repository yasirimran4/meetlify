from repositories.event import EventRepository
from exceptions.event import InvalidFomrat
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

    async def upload_thumbnail(self,thumbnail ,session ):

        ALLOWED_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]

        if thumbnail.content_type not in ALLOWED_TYPES:  # Allowed types
            raise InvalidFomrat()
        
        return await cloud_service.upload_image(thumbnail)

