import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'photo_url', label: 'Photo', type: 'photo', folder: 'staff' },
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'text', required: true },
  { key: 'join_date', label: 'Join date', type: 'date' },
  { key: 'order_index', label: 'Display order', type: 'number' },
]

export default function ManageStaff() {
  return (
    <CrudManager
      table="staff"
      title="Organization Staff"
      description="Team manager, CEO, COO and any other organization staff shown on the Organization page."
      columns={COLUMNS}
      orderBy="order_index"
    />
  )
}
