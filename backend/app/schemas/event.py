from pydantic import BaseModel , Field ,AnyUrl
from typing import Annotated  
from datetime import datetime

class CreateEventRequest(BaseModel):
    title : Annotated[str,Field(...,min_length=5,max_length=500,title="Event Name",description="Title of Event")] 
    description : Annotated[str,Field(...,min_length=100,max_length=2048,title="Event Description",description="Description of Event")] 
    speaker_name : Annotated[str,Field(...,min_length=5,max_length=100,title="Speaker Name",description="Speaker name")] 
    meeting_link : Annotated[AnyUrl,Field(...,title="Event Meet link",description="Meet link of Event")] 
    event_date_time : Annotated[datetime,Field(...,title="Event Date and Time")] 
    thumbnail_public_id : Annotated[str,Field(...,title="Thumbnail of Public ID")]
    thumbnail_url : Annotated[AnyUrl,Field(...,title="Thumbnail URl")]

class EventResponse(BaseModel):
    title: str
    description: str
    speaker_name: str
    meeting_link: AnyUrl
    event_date_time: datetime
    thumbnail_public_id: str
    thumbnail_url: AnyUrl

    model_config = {
        "from_attributes": True
    }
    