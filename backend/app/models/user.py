from sqlalchemy import Column , String , Integer  , DateTime 
from core.database import Base
from sqlalchemy.sql import func

class User(Base):   # Just for admin 

    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(100),nullable=False)
    email = Column(String(100),unique=True,nullable=False,index=True)
    hashed_password = Column(String(255),nullable=False)
    
    created_at = Column(DateTime(timezone=True),server_default = func.now())
    