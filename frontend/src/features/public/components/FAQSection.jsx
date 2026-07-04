export default function FAQSection() {
  const faqs = [
    {
      question: 'Do I need an account to register?',
      answer: "No, you don't need an account. Simply fill out the registration form with your email and details.",
    },
    {
      question: 'Are the events recorded?',
      answer: 'Yes! Most of our events are recorded. Once completed, you can find the recording linked directly on the event details page.',
    },
    {
      question: 'How do I join a live event?',
      answer: 'Upon registration, you will receive an email with the meeting link. The link will also be available on the event page shortly before it begins.',
    },
  ]

  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl">
          <dl className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.question} className="border-t border-border pt-8">
                <dt className="text-lg font-semibold leading-7 text-text-primary">{faq.question}</dt>
                <dd className="mt-2 text-base leading-7 text-text-secondary">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
