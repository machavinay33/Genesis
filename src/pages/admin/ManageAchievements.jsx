import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'tournament', label: 'Tournament', type: 'text', required: true },
  { key: 'tier', label: 'Tier (A / B / C)', type: 'text' },
  { key: 'place', label: 'Place (e.g. 1st, 12th)', type: 'text' },
  { key: 'prize', label: 'Prize (USD)', type: 'number' },
]

export default function ManageAchievements() {
  return (
    <CrudManager
      table="achievements"
      title="Tournament Results"
      description="Notable tournament placements shown on the Home and Results pages, most recent first."
      columns={COLUMNS}
      orderBy="date"
      ascending={false}
    />
  )
}
