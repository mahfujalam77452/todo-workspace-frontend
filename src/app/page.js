import { redirectIfAuthenticated } from '@/lib/auth';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import HowItWorks from '@/components/home/HowItWorks';
import CtaSection from '@/components/home/CtaSection';

// Server Component. Logged-in users are sent straight to /todos.
export default async function HomePage() {
  await redirectIfAuthenticated();

  return (
    <main>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <CtaSection />
    </main>
  );
}