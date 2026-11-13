import '@/styles/tokens.css';
import './globals.css';

export const metadata = {
  title: 'team workspace (todo)',
  description: 'Assign, accept and track todos with your team.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}