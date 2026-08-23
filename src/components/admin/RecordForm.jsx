import { useState } from 'react'
import { uploadPhoto } from '../../lib/storage'

/**
 * Generic add/edit form driven by a column schema.
 * columns: [{ key, label, type: 'text'|'number'|'date'|'textarea'|'photo'|'checkbox', required, folder }]
 */
export default function RecordForm({ columns, initialValues, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [values, setValues] = useState(() => ({ ...initialValues }))
  const [uploading, setUploading] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setField(key, val) {
    setValues((v) => ({ ...v, [key]: val }))
  }

  async function handlePhoto(col, file) {
    if (!file) return
    setUploading(col.key)
    setError('')
    try {
      const url = await uploadPhoto(file, col.folder || 'misc')
      setField(col.key, url)
    } catch (e) {
      console.error(e)
      setError('Photo upload failed. Check the "team-photos" storage bucket exists and is public.')
    } finally {
      setUploading(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit(values)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Could not save this record.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full border border-ink/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {columns.map((col) => (
          <div key={col.key} className={col.type === 'textarea' || col.type === 'photo' ? 'sm:col-span-2' : ''}>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">
              {col.label}{col.required && <span className="text-genesis"> *</span>}
            </label>

            {col.type === 'textarea' && (
              <textarea
                className="w-full border border-ink/15 px-3 py-2 text-base focus:border-genesis focus:outline-none sm:text-sm"
                rows={3}
                value={values[col.key] || ''}
                onChange={(e) => setField(col.key, e.target.value)}
                required={col.required}
              />
            )}

            {col.type === 'checkbox' && (
              <input
                type="checkbox"
                className="h-5 w-5 accent-genesis"
                checked={!!values[col.key]}
                onChange={(e) => setField(col.key, e.target.checked)}
              />
            )}

            {col.type === 'photo' && (
              <div className="flex flex-wrap items-center gap-3">
                {values[col.key] && (
                  <img src={values[col.key]} alt="" className="h-14 w-14 object-cover" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full min-w-0 max-w-full text-xs sm:w-auto"
                  onChange={(e) => handlePhoto(col, e.target.files?.[0])}
                />
                {uploading === col.key && <span className="text-xs text-genesis">Uploading…</span>}
              </div>
            )}

            {['text', 'number', 'date'].includes(col.type) && (
              <input
                type={col.type}
                className="w-full border border-ink/15 px-3 py-2 text-base focus:border-genesis focus:outline-none sm:text-sm"
                value={values[col.key] ?? ''}
                onChange={(e) =>
                  setField(col.key, col.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)
                }
                required={col.required}
              />
            )}
          </div>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-ink px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-genesis disabled:opacity-50 sm:w-auto"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full border border-ink/20 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink/70 hover:border-ink/40 sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
