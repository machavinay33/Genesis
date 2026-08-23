import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow } from '../../lib/data'
import { deletePhoto } from '../../lib/storage'
import RecordForm from './RecordForm.jsx'

/**
 * Generic list + add + edit + delete manager for a Supabase table.
 *
 * columns: schema used to build both the form and the table preview.
 *   Pass `previewOnly: true` on columns that should be hidden from the
 *   compact table preview (e.g. long text fields).
 */
export default function CrudManager({
  table,
  title,
  description,
  columns,
  orderBy = 'order_index',
  ascending = true,
  emptyRow = {},
}) {
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)

  async function refresh() {
    setStatus('loading')
    try {
      const data = await listAll(table, orderBy, ascending)
      setRows(data)
      setStatus('ready')
    } catch (e) {
      console.error(e)
      setError(e.message)
      setStatus('error')
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  async function handleCreate(values) {
    const nextOrder = rows.length ? Math.max(...rows.map((r) => Number(r.order_index) || 0)) + 1 : 1
    const payload = { ...emptyRow, ...values }
    if ('order_index' in (rows[0] || emptyRow) || columns.some((c) => c.key === 'order_index')) {
      payload.order_index = payload.order_index ?? nextOrder
    }
    await insertRow(table, payload)
    setAdding(false)
    await refresh()
  }

  async function handleUpdate(id, values) {
    await updateRow(table, id, values)
    setEditingId(null)
    await refresh()
  }

  async function handleDelete(row) {
    if (!confirm('Delete this record? This cannot be undone.')) return
    columns.forEach((c) => {
      if (c.type === 'photo' && row[c.key]) deletePhoto(row[c.key])
    })
    await deleteRow(table, row.id)
    await refresh()
  }

  const previewColumns = columns.filter((c) => !c.previewOnly && c.type !== 'textarea')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-ink">{title}</h1>
          {description && <p className="mt-1 max-w-xl text-sm text-ink/60">{description}</p>}
        </div>
        {!adding && (
          <button
            onClick={() => {
              setEditingId(null)
              setAdding(true)
            }}
            className="bg-genesis px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-ink"
          >
            + Add new
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-8">
          <RecordForm
            columns={columns}
            initialValues={emptyRow}
            onSubmit={handleCreate}
            onCancel={() => setAdding(false)}
            submitLabel="Create"
          />
        </div>
      )}

      {status === 'loading' && <p className="py-10 text-sm text-ink/50">Loading…</p>}
      {status === 'error' && <p className="py-10 text-sm text-red-600">Could not load: {error}</p>}

      {status === 'ready' && (
        <div className="overflow-x-auto border border-ink/10 bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 bg-paper text-xs font-semibold uppercase tracking-wide text-ink/50">
                {previewColumns.map((c) => (
                  <th key={c.key} className="px-4 py-3">{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={previewColumns.length + 1} className="px-4 py-8 text-center text-ink/40">
                    No records yet — add the first one above.
                  </td>
                </tr>
              )}
              {rows.map((row) =>
                editingId === row.id ? (
                  <tr key={row.id}>
                    <td colSpan={previewColumns.length + 1} className="px-4 py-4">
                      <RecordForm
                        columns={columns}
                        initialValues={row}
                        onSubmit={(values) => handleUpdate(row.id, values)}
                        onCancel={() => setEditingId(null)}
                        submitLabel="Save changes"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={row.id} className="align-top hover:bg-paper/60">
                    {previewColumns.map((c) => (
                      <td key={c.key} className="max-w-[260px] px-4 py-3 text-ink/80">
                        {c.type === 'photo' ? (
                          row[c.key] ? (
                            <img src={row[c.key]} alt="" className="h-10 w-10 object-cover" />
                          ) : (
                            <span className="text-ink/30">—</span>
                          )
                        ) : c.type === 'checkbox' ? (
                          row[c.key] ? 'Yes' : 'No'
                        ) : (
                          <span className="line-clamp-2">{String(row[c.key] ?? '—')}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setAdding(false)
                          setEditingId(row.id)
                        }}
                        className="mr-3 text-xs font-semibold uppercase tracking-wide text-ink/60 hover:text-genesis"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(row)}
                        className="text-xs font-semibold uppercase tracking-wide text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
