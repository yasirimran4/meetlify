from sqlalchemy.ext.asyncio import create_async_engine , async_sessionmaker
from core.config import settings
from sqlalchemy.orm import declarative_base 

engine = create_async_engine(settings.DATABASE_URL)

SessionLocal =  async_sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
    autocommit = False
)

Base = declarative_base()

