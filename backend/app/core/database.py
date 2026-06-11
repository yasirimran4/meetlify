from sqlalchemy.ext.asyncio import create_async_engine , async_sessionmaker ,AsyncSession
from app.core.config import settings
from sqlalchemy.orm import DeclarativeBase 

engine = create_async_engine(settings.DATABASE_URL)

SessionLocal =  async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
    autocommit = False
)

class Base(DeclarativeBase):
    pass

