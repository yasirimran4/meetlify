
class EventRepository:
    async def create_event(self,event,session):
        try:
            session.add(event)

            await session.commit()

            await session.refresh(event)

            return event

        except Exception as e:
            print("DB Error: ",str(e)) 