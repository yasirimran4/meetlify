from core.dependency import get_db
from fastapi import Depends

class EventRepository:
    async def create_event(self,request,session):
        return {"Request" : request }