from redis.asyncio import Redis

from core.config import settings


def build_redis_client() -> Redis:
    redis_url = settings.REDIS_URL
    return Redis.from_url(
        redis_url,
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=5,
    )

redis_client = build_redis_client()

