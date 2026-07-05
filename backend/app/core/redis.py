from redis.asyncio import Redis

from core.config import settings


def build_redis_client() -> Redis:
    redis_url = settings.REDIS_URL or "redis://localhost:6379/0"
    return Redis.from_url(
        redis_url,
        decode_responses=True,
        ssl=redis_url.startswith("rediss://"),
        socket_connect_timeout=5,
        socket_timeout=5,
    )


redis_client = build_redis_client()

