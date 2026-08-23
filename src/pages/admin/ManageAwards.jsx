import CrudManager from '../../components/admin/CrudManager.jsx'

const COLUMNS = [
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'award', label: 'Award (e.g. MVP)', type: 'text', required: true },
  { key: 'player', label: 'Player', type: 'text', required: true },
  { key: 'tournament', label: 'Tournament', type: 'text' },
  { key: 'prize', label: 'Prize (USD)', type: 'number' },
]

export default function ManageAwards() {
  return (
    <CrudManager
      table="awards"
      title="Individual Awards"
      description="Player-level awards such as tournament MVPs, shown on the Results page."
      columns={COLUMNS}
      orderBy="date"
      ascending={false}
    />
  )
}
