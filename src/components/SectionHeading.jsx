import useScrollReveal from '../hooks/useScrollReveal.js'

export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const isCenter = align === 'center'
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll mb-10 max-w-2xl ${isVisible ? 'is-visible' : ''} ${isCenter ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-4xl uppercase leading-[0.95] tracking-wide text-bone md:text-5xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-sm leading-relaxed text-steel md:text-base">{description}</p>}
    </div>
  )
}
