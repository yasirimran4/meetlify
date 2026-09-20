"""add public_id to events and registrations

Revision ID: a1b2c3d4e5f6
Revises: 27f4362c8e11
Create Date: 2026-09-20 09:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '27f4362c8e11'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'events',
        sa.Column('public_id', postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.add_column(
        'registrations',
        sa.Column('public_id', postgresql.UUID(as_uuid=True), nullable=True),
    )

    op.execute('UPDATE events SET public_id = gen_random_uuid() WHERE public_id IS NULL')
    op.execute('UPDATE registrations SET public_id = gen_random_uuid() WHERE public_id IS NULL')

    op.alter_column('events', 'public_id', nullable=False)
    op.alter_column('registrations', 'public_id', nullable=False)

    op.create_index('ix_events_public_id', 'events', ['public_id'], unique=True)
    op.create_index('ix_registrations_public_id', 'registrations', ['public_id'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_registrations_public_id', table_name='registrations')
    op.drop_index('ix_events_public_id', table_name='events')
    op.drop_column('registrations', 'public_id')
    op.drop_column('events', 'public_id')
