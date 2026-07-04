import PublicNavbar from '../components/PublicNavbar'
import HeroSection from '../components/HeroSection'
import EventsListSection from '../components/EventsListSection'
import WhyAttendSection from '../components/WhyAttendSection'
import FAQSection from '../components/FAQSection'
import PublicFooter from '../components/PublicFooter'
import { fetchUpcomingEvents, fetchCompletedEvents } from '../../../services/eventService'

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary/30">
      <PublicNavbar />
      <main>
        <HeroSection />
        
        <EventsListSection 
          title="Upcoming Events" 
          description="Register now for these upcoming live events." 
          fetchMethod={fetchUpcomingEvents} 
          isPast={false} 
        />
        
        <WhyAttendSection />
        
        <EventsListSection 
          title="Past Events & Recordings" 
          description="Missed a live session? Watch the recordings of our past masterclasses." 
          fetchMethod={fetchCompletedEvents} 
          isPast={true} 
        />
        
        <FAQSection />
      </main>
      <PublicFooter />
    </div>
  )
}
