from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from core.config import settings


def _create_engine():
    if not settings.DATABASE_URL:
        return None
    return create_async_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        poolclass=NullPool,
        pool_recycle=300,
    )


engine = _create_engine()
SessionLocal = None

if engine is not None:
    SessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        autoflush=False,
        expire_on_commit=False,
        autocommit=False,
    )


class Base(DeclarativeBase):
    pass

