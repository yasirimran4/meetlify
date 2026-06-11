from app.repositories.event import create_event_repo

async def create_event_service(session ):
    return await create_event_repo(session=session)

async def get_all_events_service(session ):
    return await create_event_repo(session=session)
