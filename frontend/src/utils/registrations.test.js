import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeRegistrations } from './registrations.js'

test('normalizeRegistrations extracts registrations from nested data payloads', () => {
    const payload = {
        data: {
            registrations: [
                {
                    id: 1,
                    name: 'Ada Lovelace',
                    email: 'ada@example.com',
                    current_role: 'Engineer',
                    organization: 'ACME',
                    semester: '7th',
                    reminder_sent: false,
                    created_at: '2024-01-01T00:00:00Z',
                    event_title: 'AI Meetup',
                },
            ],
            pagination: { page: 1, total_pages: 1 },
        },
    }

    const normalized = normalizeRegistrations(payload)

    assert.equal(normalized.length, 1)
    assert.equal(normalized[0].name, 'Ada Lovelace')
    assert.equal(normalized[0].eventTitle, 'AI Meetup')
})
