'use client';

import { createContext, useContext, useState } from 'react';
import { ROLES } from '@/lib/constants';

const AuthContext = createContext(null);

// The layout fetches the user on the server and passes it here,
// so user, role and team are available from the very first render.
export function AuthProvider({ initialUser, children }) {
  const [user, setUser] = useState(initialUser);

  const value = {
  user,
  setUser,
  isAdmin: user?.role === ROLES.ADMIN,
  isPM: user?.role === ROLES.PM,
   };

   
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}