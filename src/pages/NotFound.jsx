import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start px-5 py-32 md:px-8">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-6xl uppercase text-bone">Zone Closed</h1>
      <p className="mt-4 max-w-md text-steel">This page doesn&apos;t exist, or it rotated out of the map.</p>
      <Link to="/" className="mt-8 border border-genesis bg-genesis px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-void hover:bg-genesis-glow">
        Back to base
      </Link>
    </div>
  )
}
