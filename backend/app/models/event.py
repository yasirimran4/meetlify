from core.database import Base
from sqlalchemy import Column, Integer,String ,DateTime  , Enum as SQLEnum, Text
from sqlalchemy.sql import func
from time import timezone
from sqlalchemy.orm import relationship
from enum import Enum


class Status(str,Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class Event(Base):

    __tablename__ = "events"

    id = Column(Integer,primary_key=True,index=True)
    title = Column(String(255),nullable=False) 
    description = Column(Text,nullable=False) 
    speaker_name = Column(String(100),nullable=False)
    meeting_link = Column(String(200),nullable=False)
    status =  Column(SQLEnum(Status),default=Status.DRAFT,nullable=False)
    deadline = Column(DateTime(timezone=True),nullable=False)
    event_date_time = Column(DateTime(timezone=True),nullable=False)
    thumbnail_url = Column(String(500),nullable=True)
    thumbnail_public_id = Column(String(255),nullable=True)
    video_url = Column(String(500),nullable=True)
    
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())

    # relationship
    registrations = relationship("Registration",back_populates="event",cascade="all, delete-orphan")