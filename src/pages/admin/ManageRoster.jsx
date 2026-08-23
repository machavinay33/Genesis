import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'photo_url', label: 'Photo', type: 'photo', folder: 'players' },
  { key: 'ign', label: 'Player ID (IGN)', type: 'text', required: true },
  { key: 'full_name', label: 'Full name', type: 'text' },
  { key: 'role', label: 'In-game role', type: 'text' },
  { key: 'is_active', label: 'Active roster', type: 'checkbox' },
  { key: 'join_date', label: 'Join date', type: 'date' },
  { key: 'leave_date', label: 'Leave date (if former)', type: 'date' },
  { key: 'next_team_status', label: 'Next team / status (if former)', type: 'text' },
  { key: 'order_index', label: 'Display order', type: 'number' },
]

export default function ManageRoster() {
  return (
    <CrudManager
      table="players"
      title="Roster & Former Players"
      description="Toggle 'Active roster' off to move a player into the Former Players list on the History page. Upload a photo any time — it fills the reserved photo slot automatically."
      columns={COLUMNS}
      orderBy="order_index"
      emptyRow={{ is_active: true }}
    />
  )
}
