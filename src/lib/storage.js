import { supabase } from './supabaseClient'

const BUCKET = 'team-photos'

/**
 * Uploads a photo file to the public "team-photos" bucket and returns its
 * public URL. Files are namespaced by folder (e.g. "players", "staff") and
 * given a collision-proof name.
 */
export async function uploadPhoto(file, folder = 'players') {
  if (!file) return null
  const ext = file.name.split('.').pop()
  const safeName = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(safeName, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName)
  return data.publicUrl
}

/** Deletes a previously uploaded photo given its full public URL. */
export async function deletePhoto(publicUrl) {
  if (!publicUrl) return
  const marker = `/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  const path = publicUrl.slice(idx + marker.length)
  await supabase.storage.from(BUCKET).remove([path])
}
