import { Link } from 'react-router-dom'
import logo from '../assets/genesis-logo.png'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t hairline bg-char">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Genesis Esports crest" className="h-9 w-auto" />
              <span className="font-display text-xl tracking-wide">
                GENESIS <span className="text-genesis">ESPORTS</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
              Indian esports organization competing in PUBG Mobile and Battlegrounds Mobile India.
              Squad discipline. Zone control. No third-party.
            </p>
          </div>

          <div>
            <p className="eyebrow mb-4">Navigate</p>
            <ul className="space-y-2 text-sm text-bone/75">
              <li><Link className="hover:text-genesis" to="/roster">Active Roster</Link></li>
              <li><Link className="hover:text-genesis" to="/achievements">Tournament Results</Link></li>
              <li><Link className="hover:text-genesis" to="/history">Recorded Timeline</Link></li>
              <li><Link className="hover:text-genesis" to="/schedule">Upcoming Schedule</Link></li>
              <li><Link className="hover:text-genesis" to="/organization">Organization Staff</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-4">Organization</p>
            <ul className="space-y-2 text-sm text-bone/75">
              <li>India · Asia region</li>
              <li>Founded 1 February 2023</li>
              <li>Games: PUBG Mobile / BGMI</li>
              <li><Link className="hover:text-genesis" to="/admin/login">Admin sign in</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t hairline pt-6 text-xs text-steel md:flex-row md:items-center">
          <p>© {year} Genesis Esports. All results and figures reflect the organization&apos;s public profile.</p>
          <p className="font-mono text-steel2">BR // FRAG // ROTATE // WIN</p>
        </div>
      </div>
    </footer>
  )
}
