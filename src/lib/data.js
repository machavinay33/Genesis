import { supabase } from './supabaseClient'

/**
 * Thin data-access layer. Every public page and every admin manager screen
 * reads/writes through these functions so table names only live here.
 */

export const TABLES = {
  teamInfo: 'team_info',
  players: 'players',
  staff: 'staff',
  placements: 'placements',
  achievements: 'achievements',
  awards: 'awards',
  timeline: 'timeline_events',
  upcoming: 'upcoming_events',
}

// ---- Team info (singleton row) -------------------------------------------

export async function getTeamInfo() {
  const { data, error } = await supabase.from(TABLES.teamInfo).select('*').limit(1).maybeSingle()
  if (error) throw error
  return data
}

export async function updateTeamInfo(id, patch) {
  const { data, error } = await supabase.from(TABLES.teamInfo).update(patch).eq('id', id).select().maybeSingle()
  if (error) throw error
  return data
}

// ---- Players (active roster + former players share one table) ------------

export async function listActivePlayers() {
  const { data, error } = await supabase
    .from(TABLES.players)
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data
}

export async function listFormerPlayers() {
  const { data, error } = await supabase
    .from(TABLES.players)
    .select('*')
    .eq('is_active', false)
    .order('leave_date', { ascending: false })
  if (error) throw error
  return data
}

// ---- Generic CRUD helpers used by admin manager screens -------------------

export async function listAll(table, orderBy = 'order_index', ascending = true) {
  const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending })
  if (error) throw error
  return data
}

export async function insertRow(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().maybeSingle()
  if (error) throw error
  return data
}

export async function updateRow(table, id, patch) {
  const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().maybeSingle()
  if (error) throw error
  return data
}

export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  return true
}
