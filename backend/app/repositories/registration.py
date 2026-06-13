from models.registration import Registration
from sqlalchemy import select 

class RegitrationRepository:
    async def register_event(self,event_id,payload,session):
        try:
            session.add(payload)

            await session.commit()

            await session.refresh(payload)

            return payload

        except Exception as e:
            print("DB Error: ",str(e)) 

    async def list_registrations(self,event_id,session):
        try:
            registrations = await session.execute(select(Registration).where(Registration.event_id == event_id))
            return registrations.scalars().all()

        except Exception as e:
            print("DB Error: ",str(e)) 