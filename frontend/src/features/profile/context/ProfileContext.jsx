import { createContext, useContext } from 'react';
import { useProfile } from '../hooks/useProfile.js';

const ProfileContext = createContext(null);

// Calls useProfile() once and shares its state with every section below it,
// guaranteeing a single network request regardless of how many consumers mount.
export function ProfileProvider({ children }) {
  const profileState = useProfile();
  return (
    <ProfileContext.Provider value={profileState}>
      {children}
    </ProfileContext.Provider>
  );
}

// Convenience consumer hook — throws a clear error if used outside the provider.
export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfileContext must be used inside <ProfileProvider>');
  return ctx;
}
