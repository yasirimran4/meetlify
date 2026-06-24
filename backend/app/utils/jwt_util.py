from jose import JWTError , jwt
from datetime import timedelta , timezone , datetime
from core.config import settings

def create_access_token(data:dict):

    to_encode = data.copy()

    expire_time_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES

    expire = datetime.now(timezone.utc) + timedelta(minutes=expire_time_minutes)
    
    to_encode.update({"exp":expire,"type" : "access"})

    jwt_encoded = jwt.encode(to_encode,settings.SECRET_KEY,settings.ALGORITHM)

    return jwt_encoded

def create_refresh_token(data:dict):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(days=7)

    to_encode.update({"exp" : expire, "type" : "refresh"})

    jwt_encode = jwt.encode(to_encode,settings.SECRET_KEY,settings.ALGORITHM)

    return jwt_encode

def decode_token(token:str):

    try:
        payload = jwt.decode(token,settings.SECRET_KEY,settings.ALGORITHM)
        return payload
    except JWTError:
        return None  