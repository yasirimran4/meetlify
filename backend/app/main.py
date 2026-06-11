from fastapi import FastAPI
import uvicorn
from core.config import settings
from api.routes.events import event_router
from app.api.routes.registrations import registration_router

app = FastAPI(title="Meetlify Event Management System",version='1.0.1')

@app.get('/api/v1/health')
async def health():
    return {"status" : "Yes it's working" ,"DB" :settings.DATABASE_URL }

app.include_router(router=event_router)
app.include_router(router=registration_router)


if __name__ == '__main__':
    uvicorn.run(app='main:app',host='0.0.0.0',port=8000,reload=True)