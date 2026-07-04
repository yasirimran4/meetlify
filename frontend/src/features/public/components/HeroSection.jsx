export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-surface to-surface"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-text-primary sm:text-7xl">
          Learn from the best in the industry
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
          Join our premium events and masterclasses to level up your skills, network with peers, and stay ahead of the curve.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a
            href="#events"
            className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200"
          >
            Explore Events
          </a>
        </div>
      </div>
    </section>
  )
}
