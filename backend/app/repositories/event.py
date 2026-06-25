from sqlalchemy import select , update ,delete
from models.event import Event
from datetime import datetime
import logging

logger  = logging.getLogger(__name__)

class EventRepository:

    async def create_event(self,event,session):
        try:
            session.add(event)

            await session.commit()

            await session.refresh(event)

            return event

        except Exception as e:
            logger.exception("DB Error. Event not created.") 

    async def get_upcoming_events(self ,page,limit,search, session):

        try:
            offset = (page-1)* limit
            query = select(Event).where(Event.status == 'DRAFT',Event.event_date_time > datetime.now()).offset(offset).limit(limit)
            if search:
                query = query.where(Event.title.ilike(f"%{search}%"))

            events = await session.execute(query)
            return events.scalars().all()

        except Exception as e:
            logger.exception("DB Error. Event not returned..")  

    async def get_completed_events(self ,page,limit,search, session):

        try:
            offset = (page-1)* limit
            query = select(Event).where(Event.status == 'DRAFT',Event.event_date_time < datetime.now()).offset(offset).limit(limit)
            if search:
                query = query.where(Event.title.ilike(f"%{search}%"))

            events = await session.execute(query)
            return events.scalars().all()

        except Exception as e:
            logger.exception("DB Error. Event not returned..")         

    async def get_single_event(self, session,event_id):

        try:
            event = await session.execute(select(Event).where(Event.id == event_id))
            return event.scalar_one_or_none()

        except Exception as e:
            logger.exception("DB Error. Event not returned..") 

    async def get_events_requiring_reminder(self, session):

        try:
            events = await session.execute(select(Event).where(Event.status == 'PUBLISHED' , Event.event_date_time > datetime.now()))
            return events.scalars().all()

        except Exception as e:
            print("DB Error: ",str(e))                
                

    async def update_event(self,session,event_id,payload):

        try:

            event = await session.execute(update(Event).where(Event.id == event_id).values(payload).returning(Event))
            await session.commit()

            return event.scalar_one_or_none()

        except Exception as e:
            print("DB Error: ",str(e)) 

    async def change_status(self,session,event_id,status):

        try:

            event = await session.execute(update(Event).where(Event.id == event_id).values(status = status).returning(Event))
            await session.commit()

            return event.scalar_one_or_none()

        except Exception as e:
            print("DB Error: ",str(e)) 
             
    async def upload_video_url(self,session,event_id,video_url):

        try:

            event = await session.execute(update(Event).where(Event.id == event_id).values(video_url = video_url).returning(Event))
            await session.commit()

            return event.scalar_one_or_none()

        except Exception as e:
            print("DB Error: ",str(e))

    async def delete_event(self,session,event_id):

        try:

            event = await session.execute(delete(Event).where(Event.id == event_id).returning(Event))
            await session.commit()

            return event.scalar_one_or_none()

        except Exception as e:
            print("DB Error: ",str(e))                             

event_repo = EventRepository()  