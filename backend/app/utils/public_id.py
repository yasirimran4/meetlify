from uuid import UUID


def serialize_public_id(value) -> str:
    if value is None:
        return ''
    return str(value)


def parse_public_id(value) -> UUID:
    if isinstance(value, UUID):
        return value
    return UUID(str(value))
