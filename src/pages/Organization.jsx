import { useEffect, useState } from 'react'
import { getTeamInfo, listAll, TABLES } from '../lib/data'
import { formatUSD, formatDate } from '../lib/format'
import SectionHeading from '../components/SectionHeading.jsx'
import { LoadingBlock, ErrorBlock, EmptyBlock } from '../components/StateBlocks.jsx'

const INSTAGRAM_URL = 'https://www.instagram.com/genesis_esports__?igsi=emp3dnh0ZGQ2cHMz'

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function Field({ label, value }) {
  return (
    <div className="border-b hairline py-4 sm:flex sm:items-center sm:justify-between">
      <p className="font-mono text-[11px] uppercase tracking-widest2 text-steel">{label}</p>
      <p className="mt-1 text-sm text-bone sm:mt-0">{value || '—'}</p>
    </div>
  )
}

export default function Organization() {
  const [team, setTeam] = useState(null)
  const [staff, setStaff] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    Promise.all([getTeamInfo(), listAll(TABLES.staff, 'order_index')])
      .then(([t, s]) => {
        if (!alive) return
        setTeam(t)
        setStaff(s)
        setStatus('ready')
      })
      .catch((e) => {
        console.error(e)
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  if (status === 'loading') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><LoadingBlock label="Loading organization profile" /></div>
  if (status === 'error') return <div className="mx-auto max-w-7xl px-5 py-16 md:px-8"><ErrorBlock /></div>

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <SectionHeading
        eyebrow="Profile"
        title="Organization"
        description="Registration details and the people running Genesis Esports day to day."
      />

      <div className="grid gap-14 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <Field label="Team name" value={team?.team_name} />
          <Field label="Country / location" value={team?.country} />
          <Field label="Region" value={team?.region} />
          <Field label="Game" value={team?.game} />
          <Field label="Organization type" value={team?.org_type} />
          <Field label="Created" value={formatDate(team?.created_date)} />
          <Field label="Approximate total winnings" value={formatUSD(team?.total_winnings)} />
          <Field
            label="Official social"
            value={
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-genesis transition-colors hover:text-genesis-glow"
                aria-label="Open Genesis Esports Instagram profile"
              >
                <InstagramIcon />
                <span>@genesis_esports__</span>
                <span aria-hidden="true">↗</span>
              </a>
            }
          />
        </div>

        <div>
          <p className="eyebrow mb-4">Organization Staff</p>
          {staff.length === 0 ? (
            <EmptyBlock message="No staff listed yet." />
          ) : (
            <div className="space-y-4">
              {staff.map((s) => (
                <div key={s.id} className="hud-frame flex items-center gap-4 border hairline bg-char/50 p-4">
                  <span className="hud-tr" />
                  <span className="hud-bl" />
                  <div className="h-14 w-14 shrink-0 overflow-hidden bg-char2">
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-display text-2xl text-steel2">
                        {s.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-bone">{s.name}</p>
                    <p className="font-mono text-[11px] uppercase tracking-widest2 text-genesis">{s.role}</p>
                    <p className="text-xs text-steel">Since {formatDate(s.join_date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
