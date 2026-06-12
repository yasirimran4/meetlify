from repositories.event import EventRepository


event_repo = EventRepository()   # object to interact with db

class EventService:
    async def create_event(self,request, session ):
        print("in create event serviuce")
        return {"event id" : '678'}
        # return await event_repo.create_event(request,session=session)

    async def upload_thumbnail(self,thumnail ,session ):
        ALLOWED_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ]

        if thumnail not in ALLOWED_TYPES:
            pass



        
