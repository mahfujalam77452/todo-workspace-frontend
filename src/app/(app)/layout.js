import { requireUser } from '@/lib/auth';
import { AuthProvider } from '@/context/AuthContext';
import AppShell from '@/components/layout/AppShell';

// Every page inside (app) needs a logged-in user. The user is fetched once on the server
// and given to the context, so role and team are known from the first render.
export default async function AppLayout({ children }) {
  const user = await requireUser();

  return (
    <AuthProvider initialUser={user}>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}