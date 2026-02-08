/**
 * Feature Flags Configuration
 * 
 * Set features to `true` when they're ready for production.
 * Set to `false` to hide them from navigation.
 * 
 * This makes it easy to deploy incrementally without showing 404s.
 */

export const FEATURES = {
  // ===== MAIN NAVIGATION =====
  openMics: true,           // ✅ Ready
  findTalent: false,        // 🚧 In development
  courses: false,           // 🚧 In development
  community: true,          // ✅ Ready - Comedian + Superfan forums
  forVenues: true,          // ✅ Ready - Venue signup & host connections
  
  // ===== FOOTER RESOURCES =====
  blog: false,              // 🚧 Coming soon
  guides: false,            // 🚧 Coming soon
  podcast: false,           // 🚧 Coming soon
  liveEvents: false,        // 🚧 Coming soon
  
  // ===== FOOTER COMPANY =====
  about: false,             // 🚧 Coming soon
  careers: false,           // 🚧 Coming soon
  contact: false,           // 🚧 Coming soon
  press: false,             // 🚧 Coming soon
  
  // ===== FOOTER LEGAL =====
  privacy: false,           // 🚧 Need to add
  terms: false,             // 🚧 Need to add
  cookies: false,           // 🚧 Need to add
  
  // ===== USER FEATURES =====
  dashboard: true,          // ✅ Ready
  profile: true,            // ✅ Ready
  submitOpenMic: true,      // ✅ Ready
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] === true;
}

