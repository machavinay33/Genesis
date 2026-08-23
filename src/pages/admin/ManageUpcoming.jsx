import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'start_date', label: 'Start date', type: 'date', required: true },
  { key: 'end_date', label: 'End date (optional)', type: 'date' },
  { key: 'name', label: 'Tournament name', type: 'text', required: true },
  { key: 'tier', label: 'Tier (A / B / C)', type: 'text' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
]

export default function ManageUpcoming() {
  return (
    <CrudManager
      table="upcoming_events"
      title="Upcoming Schedule"
      description="Tournaments and scrim blocks the team is currently listed for. Shown on the Schedule page."
      columns={COLUMNS}
      orderBy="start_date"
      ascending={true}
    />
  )
}
