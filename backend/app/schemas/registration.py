from pydantic import EmailStr , Field ,BaseModel
from typing import Annotated 
from datetime import datetime
class CreateRegistration(BaseModel):
    name : Annotated[str,Field(...,min_length=3,max_length=100,title="Member Name",description="Name of Member")] 
    email : Annotated[EmailStr,Field(...)]
    current_role : Annotated[str,Field(...,min_length=5,max_length=100,title="Current Role",description="Speaker name")] 
    organization : Annotated[str,Field(...,title="Organization ",description="Organization of member")] 
    semester : Annotated[str,Field(...,title="Semester.")]


class RegistrationResponse(BaseModel):
    id: int
    current_role: str
    organization: str
    reminder_sent: bool
    name: str
    email: EmailStr
    semester: str
    created_at: datetime

    model_config = {
        "from_attributes": True    # For making dictionary then to store in redis memory
    }

class RegistrationPagination(BaseModel):
    page :int
    limit : int
    total_items : int
    total_pages : int
    has_next : bool
    has_previous : bool    

class RegistrationList(BaseModel):
    items : list
    pagination : RegistrationPagination     #    Nested Model

class DashboardResponse(BaseModel):
    total_events:int
    upcoming_events:int
    completed_events:int
    total_registrations:int