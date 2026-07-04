from models.registration import Registration
from sqlalchemy import select, update, func, or_
from models.event import Event

import logging

logger  = logging.getLogger(__name__)

class RegitrationRepository:
    async def register_event(self,payload,session):
        try:
            session.add(payload)

            await session.commit()

            await session.refresh(payload)

            return payload

        except Exception as e:
            logger.exception("DB Error.") 

    

    async def get_registration_by_email(self,event_id,email,session):
        try:
            registration = await session.execute(select(Registration).where(Registration.event_id == event_id,Registration.email == email))
            return registration.scalar_one_or_none()

        except Exception as e:
            print("DB Error: ",str(e))        

    async def pending_registrations_reminder(self,event_id,session):
        try:
            registrations = await session.execute(select(Registration).where(Registration.event_id == event_id,Registration.reminder_sent == False))
            return registrations.scalars().all()

        except Exception as e:
            logger.exception("DB Error.") 
 

    async def get_registrations_count(self,session):
        try:
            registrations = await session.execute(select(func.count()).select_from(Registration))
            return registrations.scalar()

        except Exception as e:
            logger.exception("DB Error") 
             

    async def mark_reminder_sent(self,registration_id,session):
        try:
            registration = await session.execute(update(Registration).where(Registration.id == registration_id).values(reminder_sent=True).returning(Registration))
            await session.commit()

        except Exception as e:
            logger.exception("DB Error.") 
        
                 

    async def get_all_registrations_global(self, page, limit, search, event_id, status, session):
        try:
            query = select(Registration, Event.title.label("event_title")).join(Event, Registration.event_id == Event.id)
            
            if search:
                query = query.where(or_(Registration.name.ilike(f"%{search}%"), Registration.email.ilike(f"%{search}%")))
            if event_id:
                query = query.where(Registration.event_id == event_id)
            if status:
                if status == "reminder_sent":
                    query = query.where(Registration.reminder_sent == True)
                elif status == "pending":
                    query = query.where(Registration.reminder_sent == False)

            total_query = select(func.count()).select_from(query.subquery())
            total_items = await session.execute(total_query)
            total_items = total_items.scalar() or 0

            query = query.order_by(Registration.created_at.desc()).offset((page - 1) * limit).limit(limit)
            results = await session.execute(query)
            
            items = []
            for reg, event_title in results:
                item_dict = {
                    "id": reg.id,
                    "name": reg.name,
                    "email": reg.email,
                    "current_role": reg.current_role,
                    "organization": reg.organization,
                    "semester": reg.semester,
                    "reminder_sent": reg.reminder_sent,
                    "created_at": reg.created_at,
                    "event_id": reg.event_id,
                    "event_title": event_title
                }
                items.append(item_dict)

            import math
            return {
                "items": items,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total_items": total_items,
                    "total_pages": math.ceil(total_items / limit) if total_items > 0 else 0,
                    "has_next": (page * limit) < total_items,
                    "has_previous": page > 1
                }
            }
        except Exception as e:
            logger.exception("DB Error in get_all_registrations_global.")
            raise e

regitration_repo = RegitrationRepository()
