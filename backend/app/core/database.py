from sqlalchemy.ext.asyncio import create_async_engine , async_sessionmaker ,AsyncSession
from core.config import settings
from sqlalchemy.orm import DeclarativeBase 

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300
)

SessionLocal =  async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
    autocommit = False
)

class Base(DeclarativeBase):
    pass

