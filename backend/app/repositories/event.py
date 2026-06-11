from core.dependency import get_db
from fastapi import Depends
async def create_event_repo(session):
    return {"Session" : session}