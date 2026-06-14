from pydantic import EmailStr , Field ,BaseModel
from typing import Annotated 

class CreateRegistration(BaseModel):
    name : Annotated[str,Field(...,min_length=3,max_length=100,title="Member Name",description="Name of Member")] 
    email : Annotated[EmailStr,Field(...)]
    current_role : Annotated[str,Field(...,min_length=5,max_length=100,title="Current Role",description="Speaker name")] 
    organization : Annotated[str,Field(...,title="Organization ",description="Organization of member")] 
    semester : Annotated[str,Field(...,title="Semester.")]