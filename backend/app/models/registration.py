from core.database import Base
from sqlalchemy import Column, Integer,String,ForeignKey ,DateTime , UniqueConstraint
from sqlalchemy.sql import func
from time import timezone
from sqlalchemy.orm import relationship 

class Registration(Base):

    __tablename__ = "registrations"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(100),nullable=False) 
    email = Column(String(100),nullable=False) 
    current_role = Column(String(100))
    organization = Column(String(100))
    semester = Column(String(100),nullable=True)

    created_at = Column(DateTime(timezone=True),server_default=func.now())
    max_seats = Column(Integer,default=100,nullable=False)
    # relationship
    event_id = Column(Integer,ForeignKey("events.id"),nullable=False,index=True)
    event = relationship("Event",back_populates="registrations")

    __table_args__ = (UniqueConstraint("event_id","email",name="uq_event_email"),)