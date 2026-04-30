import {
  resolveAccountRole,
  resolveAccountRoleWithHints,
  shouldPersistResolvedRole,
  shouldSyncProfileRoleFromMetadata,
  getRoleFromAuthUser,
  isAdminProfileRole,
} from '@/lib/account-role'

describe('resolveAccountRole', () => {
  it('uses auth metadata when profile.role is generic user', () => {
    expect(resolveAccountRole('user', 'superfan')).toBe('superfan')
    expect(resolveAccountRole('user', 'venue')).toBe('venue')
    expect(resolveAccountRole('user', 'comedian')).toBe('comedian')
  })

  it('is case-insensitive for metadata and profile role', () => {
    expect(resolveAccountRole('user', 'Superfan')).toBe('superfan')
    expect(resolveAccountRole('USER', 'SUPERFAN')).toBe('superfan')
    expect(resolveAccountRole('Superfan', 'comedian')).toBe('superfan')
  })

  it('keeps superfan/venue from profile when metadata is only comedian', () => {
    expect(resolveAccountRole('superfan', 'comedian')).toBe('superfan')
    expect(resolveAccountRole('venue', 'comedian')).toBe('venue')
  })

  it('prefers auth metadata superfan/venue over profiles.role comedian (dev / stale DB)', () => {
    expect(resolveAccountRole('comedian', 'superfan')).toBe('superfan')
    expect(resolveAccountRole('user', 'superfan')).toBe('superfan')
    expect(resolveAccountRole('comedian', 'venue')).toBe('venue')
  })

  it('defaults to comedian when nothing indicates superfan or venue', () => {
    expect(resolveAccountRole('user', undefined)).toBe('comedian')
    expect(resolveAccountRole(undefined, undefined)).toBe('comedian')
  })
})

describe('resolveAccountRoleWithHints', () => {
  it('infers superfan when only superfan_profiles row exists', () => {
    expect(
      resolveAccountRoleWithHints('user', undefined, {
        hasSuperfanProfileRow: true,
        hasVenueProfileRow: false,
      })
    ).toBe('superfan')
  })

  it('does not override explicit metadata with hints', () => {
    expect(
      resolveAccountRoleWithHints('user', 'venue', {
        hasSuperfanProfileRow: true,
        hasVenueProfileRow: false,
      })
    ).toBe('venue')
  })

  it('prefers comedian when comedian_profiles exists alongside superfan row', () => {
    expect(
      resolveAccountRoleWithHints('comedian', undefined, {
        hasSuperfanProfileRow: true,
        hasVenueProfileRow: false,
        hasComedianProfileRow: true,
      })
    ).toBe('comedian')
    expect(
      resolveAccountRoleWithHints('user', undefined, {
        hasSuperfanProfileRow: true,
        hasVenueProfileRow: false,
        hasComedianProfileRow: true,
      })
    ).toBe('comedian')
  })
})

describe('getRoleFromAuthUser', () => {
  it('reads role from user_metadata', () => {
    expect(
      getRoleFromAuthUser({
        user_metadata: { role: 'superfan' },
        app_metadata: {},
      })
    ).toBe('superfan')
  })

  it('falls back to alternate keys', () => {
    expect(
      getRoleFromAuthUser({
        user_metadata: { user_role: 'venue' },
        app_metadata: {},
      })
    ).toBe('venue')
  })
})

describe('shouldPersistResolvedRole', () => {
  it('is true when DB role is generic and resolved differs', () => {
    expect(shouldPersistResolvedRole('user', 'superfan')).toBe(true)
    expect(shouldPersistResolvedRole(null, 'comedian')).toBe(true)
  })

  it('is false when already aligned', () => {
    expect(shouldPersistResolvedRole('superfan', 'superfan')).toBe(false)
    expect(shouldPersistResolvedRole('comedian', 'comedian')).toBe(false)
  })

  it('never overwrites admin', () => {
    expect(shouldPersistResolvedRole('admin', 'comedian')).toBe(false)
  })
})

describe('shouldSyncProfileRoleFromMetadata', () => {
  it('is true for generic DB role and explicit metadata', () => {
    expect(shouldSyncProfileRoleFromMetadata('user', 'superfan')).toBe(true)
  })

  it('is false when DB already has a concrete role', () => {
    expect(shouldSyncProfileRoleFromMetadata('superfan', 'comedian')).toBe(false)
  })

  it('is false without metadata', () => {
    expect(shouldSyncProfileRoleFromMetadata('user', undefined)).toBe(false)
  })
})

describe('isAdminProfileRole', () => {
  it('is true for admin with any casing', () => {
    expect(isAdminProfileRole('admin')).toBe(true)
    expect(isAdminProfileRole('Admin')).toBe(true)
    expect(isAdminProfileRole(' ADMIN ')).toBe(true)
  })

  it('is false for other roles', () => {
    expect(isAdminProfileRole('comedian')).toBe(false)
    expect(isAdminProfileRole(null)).toBe(false)
    expect(isAdminProfileRole(undefined)).toBe(false)
  })
})
