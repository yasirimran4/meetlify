from pydantic import BaseModel, Field, AnyUrl, field_validator, model_validator
from typing import Annotated, Any
from datetime import datetime, timezone
from models.event import Status

DEFAULT_EVENT_ORGANIZERS = ["Dr. Zobia Suhail"]


def _clean_name_list(value: Any, field_name: str) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        items = [value]
    elif isinstance(value, (list, tuple, set)):
        items = list(value)
    else:
        raise ValueError(f"{field_name} must be a string or list of strings.")

    cleaned: list[str] = []
    for item in items:
        if item is None:
            continue
        name = str(item).strip()
        if not name:
            raise ValueError(f"{field_name} cannot contain blank names.")
        if len(name) < 2:
            raise ValueError(f"{field_name} names must contain at least 2 characters.")
        cleaned.append(name)

    return cleaned


class CreateEventRequest(BaseModel):
    title: Annotated[str, Field(..., min_length=5, max_length=500, title="Event Name", description="Title of Event")]
    description: Annotated[str, Field(..., min_length=100, max_length=5000, title="Event Description", description="Description of Event")]
    speaker_name: str | None = None
    speakers: list[str] = Field(default_factory=list)
    organizers: list[str] = Field(default_factory=list)
    meeting_link: Annotated[AnyUrl, Field(..., title="Event Meet link", description="Meet link of Event")]
    event_date_time: Annotated[datetime, Field(..., title="Event Date and Time")]
    thumbnail_public_id: Annotated[str, Field(..., title="Thumbnail of Public ID")]
    thumbnail_url: Annotated[AnyUrl, Field(..., title="Thumbnail URl")]

    @model_validator(mode="before")
    @classmethod
    def normalize_legacy_fields(cls, data: Any):
        if not isinstance(data, dict):
            return data

        if isinstance(data.get("speakers"), str):
            data["speakers"] = [data["speakers"]]
        if isinstance(data.get("organizers"), str):
            data["organizers"] = [data["organizers"]]
        if data.get("speaker_name") and not data.get("speakers"):
            data["speakers"] = [data["speaker_name"]]
        if data.get("organizer_name") and not data.get("organizers"):
            data["organizers"] = [data["organizer_name"]]
        return data

    @field_validator("speaker_name", mode="before")
    @classmethod
    def normalize_legacy_speaker_name(cls, value: Any):
        if value is None:
            return value
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("speaker_name cannot be blank.")
            return value
        raise ValueError("speaker_name must be a string.")

    @field_validator("speakers", "organizers", mode="before")
    @classmethod
    def validate_name_lists(cls, value: Any, info):
        if value is None or value == []:
            return []
        cleaned = _clean_name_list(value, info.field_name)
        if info.field_name == "organizers" and not cleaned:
            return list(DEFAULT_EVENT_ORGANIZERS)
        return cleaned

    @model_validator(mode="after")
    def finalize_names(self):
        if not self.speakers and self.speaker_name:
            self.speakers = [self.speaker_name.strip()]
        if not self.speakers and self.speaker_name is None:
            raise ValueError("At least one speaker name is required.")

        if not self.organizers:
            self.organizers = list(DEFAULT_EVENT_ORGANIZERS)

        self.speakers = [name.strip() for name in self.speakers if name and name.strip()]
        self.organizers = [name.strip() for name in self.organizers if name and name.strip()]

        if not self.speakers:
            raise ValueError("At least one speaker name is required.")
        if not self.organizers:
            self.organizers = list(DEFAULT_EVENT_ORGANIZERS)

        return self

    @field_validator("event_date_time")
    @classmethod
    def validate_event_date_time(cls, value: datetime):
        if value <= datetime.now(timezone.utc):
            raise ValueError("Event date and time must be in the future.")
        return value


class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    speaker_name: str | None = None
    speakers: list[str] = Field(default_factory=list)
    organizers: list[str] = Field(default_factory=list)
    meeting_link: AnyUrl
    event_date_time: datetime
    status: Status
    thumbnail_public_id: str
    thumbnail_url: AnyUrl | None = None
    video_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    @model_validator(mode="before")
    @classmethod
    def normalize_response_data(cls, data: Any):
        if not isinstance(data, dict):
            return data

        speakers = data.get("speakers")
        if speakers is None and data.get("speaker_name"):
            if isinstance(data["speaker_name"], str):
                data["speakers"] = [data["speaker_name"].strip()]
            elif isinstance(data["speaker_name"], list):
                data["speakers"] = data["speaker_name"]

        organizers = data.get("organizers")
        if organizers is None:
            if data.get("organizer_name"):
                data["organizers"] = [data["organizer_name"]] if isinstance(data["organizer_name"], str) else data["organizer_name"]
            else:
                data["organizers"] = list(DEFAULT_EVENT_ORGANIZERS)

        if not data.get("speaker_name") and isinstance(data.get("speakers"), list) and data["speakers"]:
            data["speaker_name"] = data["speakers"][0]
        if not data.get("organizer_name") and isinstance(data.get("organizers"), list) and data["organizers"]:
            data["organizer_name"] = data["organizers"][0]

        return data

    model_config = {
        "from_attributes": True
    }


class EventAnalytics(BaseModel):
    registrations: int
    status: Status

    model_config = {
        "from_attributes": True
    }
