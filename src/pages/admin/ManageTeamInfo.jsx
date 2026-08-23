import { useEffect, useState } from 'react'
import { getTeamInfo, updateTeamInfo } from '../../lib/data'
import RecordForm from '../../components/admin/RecordForm.jsx'

const COLUMNS = [
  { key: 'team_name', label: 'Team name', type: 'text', required: true },
  { key: 'country', label: 'Country / location', type: 'text' },
  { key: 'region', label: 'Region', type: 'text' },
  { key: 'game', label: 'Game', type: 'text' },
  { key: 'org_type', label: 'Organization type', type: 'text' },
  { key: 'created_date', label: 'Created date', type: 'date' },
  { key: 'total_winnings', label: 'Approximate total winnings (USD)', type: 'number' },
  { key: 'instagram_url', label: 'Instagram URL', type: 'text' },
  { key: 'hero_tagline', label: 'Homepage hero tagline', type: 'textarea' },
  { key: 'squad_photo_url', label: 'Full squad photo (shown above roster)', type: 'photo', folder: 'squad' },
]

export default function ManageTeamInfo() {
  const [record, setRecord] = useState(null)
  const [status, setStatus] = useState('loading')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getTeamInfo()
      .then((data) => {
        setRecord(data)
        setStatus('ready')
      })
      .catch((e) => {
        console.error(e)
        setStatus('error')
      })
  }, [])

  async function handleSave(values) {
    const updated = await updateTeamInfo(record.id, values)
    setRecord(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink">Team Info</h1>
      <p className="mt-1 max-w-xl text-sm text-ink/60">
        This powers the hero section, organization profile, and the squad photo placeholder above the roster.
      </p>

      {status === 'loading' && <p className="py-10 text-sm text-ink/50">Loading…</p>}
      {status === 'error' && <p className="py-10 text-sm text-red-600">Could not load team info. Confirm the "team_info" table has one row.</p>}

      {status === 'ready' && record && (
        <div className="mt-6 max-w-2xl">
          {saved && <p className="mb-4 border border-green-600/30 bg-green-50 px-4 py-2 text-sm text-green-700">Saved.</p>}
          <RecordForm columns={COLUMNS} initialValues={record} onSubmit={handleSave} onCancel={() => {}} submitLabel="Save changes" />
        </div>
      )}
    </div>
  )
}
