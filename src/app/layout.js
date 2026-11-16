import '@/styles/tokens.css';
import '@/styles/animations.css';
import './globals.css';

export const metadata = {
  title: { default: 'TODOs Workspace', template: '%s · TODOs Workspace' },
  description: 'Assign, accept and track todos with your team.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}