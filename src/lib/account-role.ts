/**
 * Maps DB + auth metadata to the three profile-edit / dashboard experiences.
 *
 * Signup stores role in auth user_metadata (e.g. superfan), while profiles.role
 * often defaults to "user" until we persist — we must not treat "user" as comedian
 * when metadata says superfan or venue.
 *
 * Also infers superfan/venue from existing profile rows when metadata is missing
 * (stale sessions, casing, or keys).
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export type AccountRole = 'comedian' | 'superfan' | 'venue'

function norm(s: string | null | undefined): string | null {
  if (s == null || typeof s !== 'string') return null
  const t = s.trim().toLowerCase()
  return t.length ? t : null
}

/** True when `profiles.role` is the app moderator role (case-insensitive). */
export function isAdminProfileRole(role: string | null | undefined): boolean {
  return norm(role) === 'admin'
}

/** Read role from Supabase user (tries a few keys; case handled in resolve). */
export function getRoleFromAuthUser(user: {
  user_metadata?: Record<string, unknown> | null
  app_metadata?: Record<string, unknown> | null
}): string | undefined {
  const meta = user.user_metadata ?? undefined
  const app = user.app_metadata ?? undefined
  const keys = ['role', 'user_role', 'account_role']
  for (const k of keys) {
    const v = meta?.[k] ?? app?.[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return undefined
}

/** Merge session + getUser so role is picked up after fresh login (JWT can differ slightly). */
export async function getAuthRoleHintFromClient(supabase: SupabaseClient): Promise<string | undefined> {
  const [{ data: sessionData }, { data: userData }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ])
  const fromUser = getRoleFromAuthUser(userData?.user ?? {})
  const fromSession = getRoleFromAuthUser(sessionData?.session?.user ?? {})
  return fromUser || fromSession
}

/**
 * Auth metadata from signup (`user_metadata.role`) is the source of truth for superfan/venue
 * when `profiles.role` is still the default `comedian` / `user` from handle_new_user.
 * When both name superfan vs venue, prefer metadata (re-signup / dashboard edits).
 */
export function resolveAccountRole(
  profileRole: string | null | undefined,
  metadataRole: string | null | undefined
): AccountRole {
  const pr = norm(profileRole)
  const mr = norm(metadataRole)

  const prFanVenue = pr === 'superfan' || pr === 'venue' ? pr : null
  const mrFanVenue = mr === 'superfan' || mr === 'venue' ? mr : null

  if (mrFanVenue && prFanVenue && mrFanVenue !== prFanVenue) {
    return mrFanVenue
  }
  if (mrFanVenue) return mrFanVenue
  if (prFanVenue) return prFanVenue

  if (pr === 'comedian' || pr === 'host' || pr === 'promoter') return 'comedian'
  if (mr === 'comedian' || mr === 'host' || mr === 'promoter') return 'comedian'

  return 'comedian'
}

/** When base resolution is still "comedian", use table presence as a hint (signup row exists). */
export function resolveAccountRoleWithHints(
  profileRole: string | null | undefined,
  metadataRole: string | null | undefined,
  hints?: {
    hasSuperfanProfileRow?: boolean
    hasVenueProfileRow?: boolean
    /** If true, do not infer "superfan" from a stray superfan_profiles row (comedian is primary). */
    hasComedianProfileRow?: boolean
  }
): AccountRole {
  const base = resolveAccountRole(profileRole, metadataRole)
  if (base !== 'comedian') return base

  const sf = hints?.hasSuperfanProfileRow
  const vn = hints?.hasVenueProfileRow
  const comic = hints?.hasComedianProfileRow

  if (sf && !vn) {
    if (comic) return 'comedian'
    return 'superfan'
  }
  if (vn && !sf) return 'venue'
  if (sf && vn) {
    const pr = norm(profileRole)
    if (pr === 'venue') return 'venue'
    if (comic) return 'comedian'
    return 'superfan'
  }
  return 'comedian'
}

function canonicalRoleFromDb(profileRole: string | null | undefined): AccountRole | null {
  const pr = norm(profileRole)
  if (pr === 'superfan' || pr === 'venue') return pr
  if (pr === 'comedian' || pr === 'host' || pr === 'promoter') return 'comedian'
  return null
}

/** Persist profiles.role when it doesn't match resolved UI role (e.g. user → superfan). Never overwrites admin. */
export function shouldPersistResolvedRole(
  profileRole: string | null | undefined,
  resolved: AccountRole
): boolean {
  if (norm(profileRole) === 'admin') return false
  const canonical = canonicalRoleFromDb(profileRole)
  if (canonical === resolved) return false
  return true
}

/** @deprecated prefer shouldPersistResolvedRole + getRoleFromAuthUser */
export function shouldSyncProfileRoleFromMetadata(
  profileRole: string | null | undefined,
  metadataRole: string | null | undefined
): boolean {
  const pr = norm(profileRole)
  const mr = norm(metadataRole)
  if (!mr) return false
  if (pr === 'superfan' || pr === 'venue' || pr === 'comedian' || pr === 'host' || pr === 'promoter') {
    return false
  }
  return mr === 'superfan' || mr === 'venue' || mr === 'comedian'
}
