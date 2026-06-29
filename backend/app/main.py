from fastapi import FastAPI
from routes.events import event_router
from routes.admin_routes import admin_router
from routes.auth import auth_router
from core.exception_handler import app_exception_handler
from exceptions.base import AppException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Meetlify Event Management System",version='1.0.1')

@app.get('/health')
async def health():
    return {"status" : "Yes it's working" }


# CORS Settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Including routes
app.include_router(router=admin_router)
app.include_router(router=event_router)
app.include_router(router=auth_router)



# Global Exceptional Handler
app.add_exception_handler(AppException,app_exception_handler)

 