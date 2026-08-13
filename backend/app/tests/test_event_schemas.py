from schemas.event import CreateEventRequest, DEFAULT_EVENT_ORGANIZERS


def test_create_event_request_supports_multiple_speakers_and_organizers():
    request = CreateEventRequest.model_validate({
        "title": "AI Innovations",
        "description": "A detailed event overview with enough content to pass validation and satisfy the required minimum length for event descriptions.",
        "speaker_name": "Dr. Ali Khan",
        "speakers": ["Dr. Ali Khan", "Dr. Ayesha Noor"],
        "organizers": ["Dr. Zobia Suhail", "Dr. Bilal Ahmed"],
        "meeting_link": "https://meet.google.com/example",
        "event_date_time": "2099-01-15T18:30:00+00:00",
        "thumbnail_public_id": "abc",
        "thumbnail_url": "https://images.example.com/event.jpg",
    })

    assert request.speakers == ["Dr. Ali Khan", "Dr. Ayesha Noor"]
    assert request.organizers == ["Dr. Zobia Suhail", "Dr. Bilal Ahmed"]


def test_create_event_request_defaults_organizers_when_missing():
    request = CreateEventRequest.model_validate({
        "title": "AI Innovations",
        "description": "A detailed event overview with enough content to pass validation and satisfy the required minimum length for event descriptions.",
        "speaker_name": "Dr. Ali Khan",
        "meeting_link": "https://meet.google.com/example",
        "event_date_time": "2099-01-15T18:30:00+00:00",
        "thumbnail_public_id": "abc",
        "thumbnail_url": "https://images.example.com/event.jpg",
    })

    assert request.speakers == ["Dr. Ali Khan"]
    assert request.organizers == DEFAULT_EVENT_ORGANIZERS


def test_create_event_request_rejects_blank_names():
    try:
        CreateEventRequest.model_validate({
            "title": "AI Innovations",
            "description": "A detailed event overview with enough content to pass validation and satisfy the required minimum length for event descriptions.",
            "speakers": ["Dr. Ali Khan", "   ", ""],
            "organizers": ["Dr. Zobia Suhail", "   "],
            "meeting_link": "https://meet.google.com/example",
            "event_date_time": "2099-01-15T18:30:00+00:00",
            "thumbnail_public_id": "abc",
            "thumbnail_url": "https://images.example.com/event.jpg",
        })
    except ValueError:
        return

    raise AssertionError("blank speaker or organizer names should be rejected")
