import { useState, useCallback, useEffect } from 'react'
import PublicNavbar from '../components/PublicNavbar'
import PublicFooter from '../components/PublicFooter'
import PublicEventCard from '../components/PublicEventCard'
import SearchInput from '../../../components/ui/SearchInput'
import LoadingState from '../../../components/ui/LoadingState'
import EmptyState from '../../../components/ui/EmptyState'
import Pagination from '../../../components/ui/Pagination'
import { fetchUpcomingEvents, fetchCompletedEvents } from '../../../services/eventService'

export default function PublicEventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' | 'completed'
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const loadEvents = useCallback(async (tab, page, search) => {
    setIsLoading(true)
    setError(null)
    try {
      const fetcher = tab === 'upcoming' ? fetchUpcomingEvents : fetchCompletedEvents
      const response = await fetcher({ page, limit: 12, search })
      setEvents(response?.items || [])
      setPagination(response?.pagination || null)
    } catch (err) {
      setError('Failed to load events. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents(activeTab, currentPage, searchQuery)
  }, [activeTab, currentPage, searchQuery, loadEvents])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
    setCurrentPage(1)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchInput('')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface selection:bg-primary/30">
      <PublicNavbar />
      
      <main className="flex-1">
        <div className="bg-surface-muted py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">All Events</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              Discover and register for upcoming events or catch up on past masterclasses.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex rounded-lg bg-surface-subtle p-1 border border-border">
              <button
                onClick={() => handleTabChange('upcoming')}
                className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'upcoming' ? 'bg-surface text-text-primary shadow' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => handleTabChange('completed')}
                className={`flex-1 rounded-md py-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'completed' ? 'bg-surface text-text-primary shadow' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Completed
              </button>
            </div>

            <form onSubmit={handleSearch} className="w-full sm:max-w-xs">
              <SearchInput
                placeholder="Search events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>

          {isLoading ? (
            <div className="py-24">
              <LoadingState message="Loading events..." />
            </div>
          ) : error ? (
            <div className="py-24">
              <EmptyState title="Oops!" description={error} />
            </div>
          ) : events.length === 0 ? (
            <div className="py-24">
              <EmptyState 
                title={searchQuery ? 'No results found' : 'No events available'} 
                description={searchQuery ? `We couldn't find anything matching "${searchQuery}".` : 'Check back later for new events!'}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <PublicEventCard key={event.id} event={event} isPast={activeTab === 'completed'} />
                ))}
              </div>
              
              {pagination && pagination.total_pages > 1 && (
                <div className="mt-12 border-t border-border pt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
