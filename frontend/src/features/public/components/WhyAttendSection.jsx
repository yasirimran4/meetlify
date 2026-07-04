import { Users, Zap, Video } from 'lucide-react'

export default function WhyAttendSection() {
  const benefits = [
    {
      name: 'Expert Speakers',
      description: 'Learn directly from industry leaders who share actionable insights and real-world experiences.',
      icon: Users,
    },
    {
      name: 'Actionable Knowledge',
      description: 'Walk away with practical skills and strategies you can implement immediately in your career.',
      icon: Zap,
    },
    {
      name: 'On-Demand Recordings',
      description: 'Missed a session? Access high-quality recordings of past events anytime, anywhere.',
      icon: Video,
    },
  ]

  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Why attend our events?</h2>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            Our events are crafted to deliver maximum value, whether you're joining live or watching later.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="flex flex-col items-start">
                <div className="rounded-lg bg-primary/10 p-2 ring-1 ring-primary/20">
                  <benefit.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-text-primary">{benefit.name}</dt>
                <dd className="mt-2 leading-7 text-text-secondary">{benefit.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
