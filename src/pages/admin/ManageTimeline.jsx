import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'event_date', label: 'Date', type: 'date', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
]

export default function ManageTimeline() {
  return (
    <CrudManager
      table="timeline_events"
      title="Recorded Timeline"
      description="Dated roster and staff changes shown on the History page. One row per logged event."
      columns={COLUMNS}
      orderBy="event_date"
      ascending={true}
    />
  )
}
