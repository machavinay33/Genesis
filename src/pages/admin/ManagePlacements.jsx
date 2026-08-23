import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'tier', label: 'Tier (A-Tier / B-Tier / C-Tier / Total)', type: 'text', required: true },
  { key: 'first', label: '1st place count', type: 'number' },
  { key: 'second', label: '2nd place count', type: 'number' },
  { key: 'third', label: '3rd place count', type: 'number' },
  { key: 'top3', label: 'Top 3 count', type: 'number' },
  { key: 'results', label: 'Total results', type: 'number' },
  { key: 'order_index', label: 'Display order', type: 'number' },
]

export default function ManagePlacements() {
  return (
    <CrudManager
      table="placements"
      title="Placement Summary"
      description="One row per event tier, plus a 'Total' row. Shown as the summary table on the Results page."
      columns={COLUMNS}
      orderBy="order_index"
      emptyRow={{ first: 0, second: 0, third: 0, top3: 0, results: 0 }}
    />
  )
}
