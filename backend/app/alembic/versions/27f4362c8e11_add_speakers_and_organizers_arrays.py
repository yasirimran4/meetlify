"""add_speakers_and_organizers_arrays

Revision ID: 27f4362c8e11
Revises: 4a5a612e601e
Create Date: 2026-08-13 10:19:09.180193

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '27f4362c8e11'
down_revision: Union[str, Sequence[str], None] = '4a5a612e601e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

DEFAULT_ORGANIZERS = ['Dr. Zobia Suhail']


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'events',
        sa.Column(
            'speakers',
            sa.ARRAY(sa.String()),
            nullable=True,
            server_default=sa.text("ARRAY[]::varchar[]"),
        ),
    )
    op.add_column(
        'events',
        sa.Column(
            'organizers',
            sa.ARRAY(sa.String()),
            nullable=True,
            server_default=sa.text("ARRAY['Dr. Zobia Suhail']"),
        ),
    )

    connection = op.get_bind()
    rows = connection.execute(sa.text("SELECT id, speaker_name, organizers FROM events")).fetchall()

    for event_id, speaker_name, existing_organizers in rows:
        speakers = [speaker_name.strip()] if speaker_name and speaker_name.strip() else []

        if isinstance(existing_organizers, list) and existing_organizers:
            organizers = [name.strip() for name in existing_organizers if isinstance(name, str) and name.strip()]
        else:
            organizers = list(DEFAULT_ORGANIZERS)

        if not organizers:
            organizers = list(DEFAULT_ORGANIZERS)

        connection.execute(
            sa.text("UPDATE events SET speakers = :speakers, organizers = :organizers WHERE id = :id"),
            {"speakers": speakers, "organizers": organizers, "id": event_id},
        )

    op.alter_column('events', 'speakers', nullable=False, server_default=sa.text("ARRAY[]::varchar[]"))
    op.alter_column('events', 'organizers', nullable=False, server_default=sa.text("ARRAY['Dr. Zobia Suhail']"))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('events', 'organizers')
    op.drop_column('events', 'speakers')
