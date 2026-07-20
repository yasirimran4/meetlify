import httpx
from core.config import settings

async def send_email(payload:dict):
    async with httpx.AsyncClient() as client:



        response = await client.post(url=settings.N8N_WEBHOOK_URL,json=payload,timeout=10)

        response.raise_for_status()
        print("Status Code : ",response.status_code)

        return response.json()