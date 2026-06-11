from core.database import SessionLocal

async def get_db():    # Get session to work with database
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except:
            await session.rollback()
        finally:
            await session.close()