from pydantic import EmailStr , Field 
from typing import Annotated 
from datetime import datetime

class CreateRegistration:
    name : Annotated[str,Field(...,min_length=3,max_length=100,title="Member Name",description="Name of Member")] 
    email : Annotated[EmailStr,Field(...)]
    current_role : Annotated[str,Field(...,min_length=5,max_length=100,title="Current Role",description="Speaker name")] 
    organization : Annotated[str,Field(...,title="Organization ",description="Organization of member")] 
    semester : Annotated[str,Field(...,title="Semester.")]
    event_id : Annotated[int,Field(...,title="Event ID")] 