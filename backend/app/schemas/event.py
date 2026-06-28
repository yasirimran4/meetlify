from pydantic import BaseModel , Field ,AnyUrl , field_validator
from typing import Annotated  
from datetime import datetime ,timezone

class CreateEventRequest(BaseModel):
    title : Annotated[str,Field(...,min_length=5,max_length=500,title="Event Name",description="Title of Event")] 
    description : Annotated[str,Field(...,min_length=100,max_length=2048,title="Event Description",description="Description of Event")] 
    speaker_name : Annotated[str,Field(...,min_length=5,max_length=100,title="Speaker Name",description="Speaker name")] 
    meeting_link : Annotated[AnyUrl,Field(...,title="Event Meet link",description="Meet link of Event")] 
    event_date_time : Annotated[datetime,Field(... ,title="Event Date and Time")] 
    thumbnail_public_id : Annotated[str,Field(...,title="Thumbnail of Public ID")]
    thumbnail_url : Annotated[AnyUrl,Field(...,title="Thumbnail URl")]

    @field_validator("event_date_time")
    @classmethod
    def validate_event_date_time(cls, value: datetime):
        if value <= datetime.now(timezone.utc):
            raise ValueError("Event date and time must be in the future.")
        return value

class EventResponse(BaseModel):
    title: str
    description: str
    speaker_name: str
    meeting_link: AnyUrl
    event_date_time: datetime
    thumbnail_public_id: str
    thumbnail_url: AnyUrl

    model_config = {
        "from_attributes": True    # For making dictionary then to store in redis memory
    }

class EventAnalytics(BaseModel):
    registrations:int
    reminders_sent:int
    status:str

