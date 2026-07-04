export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  COMPLETED: 'completed',
}

export const STATUS_FILTER_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Published', value: EVENT_STATUS.PUBLISHED },
  { label: 'Draft', value: EVENT_STATUS.DRAFT },
  { label: 'Completed', value: EVENT_STATUS.COMPLETED },
]

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Title A–Z', value: 'title-asc' },
]

export const PAGE_SIZE_OPTIONS = [10, 25, 50]
