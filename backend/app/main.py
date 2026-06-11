from fastapi import FastAPI
import uvicorn
from api.routes.admin import admin_router
from api.routes.events import event_router

app = FastAPI(title="Meetlify Event Management System",version='1.0.1')

@app.get('/v1/api/health')
async def health():
    return {"status" : "Yes it's working" }

app.include_router(router=admin_router)
app.include_router(router=event_router)


if __name__ == '__main__':
    uvicorn.run(app='main:app',host='0.0.0.0',port=8000,reload=True)