from models.registration import Registration
from sqlalchemy import select ,update ,func

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
        
                 

regitration_repo = RegitrationRepository()
