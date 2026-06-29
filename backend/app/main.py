from fastapi import FastAPI
from routes.events import event_router
from routes.admin_routes import admin_router
from routes.auth import auth_router
from core.exception_handler import app_exception_handler
from exceptions.base import AppException
app = FastAPI(title="Meetlify Event Management System",version='1.0.1')
from core.redis import redis_client
@app.get('/api/v1/health')
async def health():
    return {"status" : "Yes it's working" }

@app.get('/api/v1/redis')
async def redis_test():
    await redis_client.set("Name","Yasir")
    return {"name" : "Yasir" }


# Including routes
app.include_router(router=admin_router)
app.include_router(router=event_router)
app.include_router(router=auth_router)




# Global Exceptional Handler
app.add_exception_handler(AppException,app_exception_handler)

 