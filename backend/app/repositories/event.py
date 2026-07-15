from sqlalchemy import select , update ,delete , func
from models.event import Event
from datetime import datetime,timezone, timedelta
import logging
from models.event import Status
from models.registration import Registration
import math

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
            raise

    async def get_events(self, session, page: int = 1, limit: int = 10, search: str = None, status: Status = None):
        try:
            offset = (page - 1) * limit
            query = select(Event)
            
            if status:
                query = query.where(Event.status == status)
            if search:
                query = query.where(Event.title.ilike(f"%{search}%"))
                
            count_query = select(func.count()).select_from(query.subquery())
            total_items = await session.execute(count_query)
            total_items = total_items.scalar()
            
            query = query.order_by(Event.event_date_time.desc()).offset(offset).limit(limit)
            events = await session.execute(query)
            events_list = events.scalars().all()
            
            total_pages = math.ceil(total_items / limit) if total_items > 0 else 0
            
            return {
                "items": events_list,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total_items": total_items,
                    "total_pages": total_pages,
                    "has_next": page < total_pages,
                    "has_previous": page > 1
                }
            }
        except Exception as e:
            logger.exception("DB Error. Event not returned..")
            raise

    async def get_upcoming_events(self ,page,limit,search, session):
        return await self.get_events(session, page, limit, search, Status.PUBLISHED)

    async def get_completed_events(self ,page,limit,search, session):
        return await self.get_events(session, page, limit, search, Status.COMPLETED)

    async def get_single_event(self, session,event_id):
        try:
            event = await session.execute(select(Event).where(Event.id == event_id))
            return event.scalar_one_or_none()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise

    async def update_event(self,session,event_id,payload):
        try:
            event = await session.execute(update(Event).where(Event.id == event_id).values(payload).returning(Event))
            await session.commit()
            return event.scalar_one_or_none()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise

    async def delete_event(self,session,event_id):
        try:
            event = await session.execute(delete(Event).where(Event.id == event_id).returning(Event))
            await session.commit()
            return event.scalar_one_or_none()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise
             
    async def upload_video_url(self,session,event_id,video_url):
        try:
            event = await session.execute(update(Event).where(Event.id == event_id).values(video_url = video_url).returning(Event))
            await session.commit()
            return event.scalar_one_or_none()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise

    async def publish_event(self,session,event_id):
        try:
            event = await session.execute(update(Event).where(Event.id == event_id).values(status = Status.PUBLISHED).returning(Event))
            await session.commit()
            return event.scalar_one_or_none()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise

    async def complete_event(self,session,event_id):
        try:
            event = await session.execute(update(Event).where(Event.id == event_id).values(status = Status.COMPLETED).returning(Event))
            await session.commit()
            return event.scalar_one_or_none()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise

    async def get_all_registrations_by_event_id(self,event_id,session):
        try:
            registrations = await session.execute(select(Registration).where(Registration.event_id == event_id))
            return registrations.scalars().all()
        except Exception as e:
            print("DB Error: ",str(e))
            raise

    async def list_registrations(self,event_id,page,limit,session):
        try:
            offset = (page-1)* limit
            registrations = await session.execute(select(Registration).where(Registration.event_id == event_id).offset(offset).limit(limit))
            return registrations.scalars().all()
        except Exception as e:
            print("DB Error: ",str(e))
            raise

    async def upcoming_events_count(self,session):
        try:
            events = await session.execute(select(func.count()).where(Event.status == Status.PUBLISHED,Event.event_date_time > datetime.now(timezone.utc)).select_from(Event))
            return events.scalar()
        except Exception as e:
            print("DB Error: ",str(e)) 
            raise

    async def completed_events_count(self,session):
        try:
            events = await session.execute(select(func.count()).where(Event.status == Status.COMPLETED,Event.event_date_time < datetime.now(timezone.utc)).select_from(Event))
            return events.scalar()
        except Exception as e:
            print("DB Error: ",str(e))   
            raise

    async def get_events_requiring_reminder(self, session):
        try:
            now = datetime.now(timezone.utc)
            one_hour_from_now = now + timedelta(hours=1)
            events = await session.execute(
                select(Event).where(
                    Event.status == Status.PUBLISHED,
                    Event.event_date_time <= one_hour_from_now,
                    Event.event_date_time > now
                )
            )
            return events.scalars().all()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise
                
    async def complete_expired_events(self,session):
        try:
            await session.execute(update(Event).where(Event.status == Status.PUBLISHED,Event.event_date_time <= datetime.now(timezone.utc)).values(status=Status.COMPLETED))
            await session.commit()
        except Exception as e:
            logger.exception("DB Error. Event not returned..") 
            raise
            
                            
event_repo = EventRepository()  