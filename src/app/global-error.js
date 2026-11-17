'use client';

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body
        style={{
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <div>
          <h1>Something went wrong</h1>
          <p>The app could not be loaded. Please try again.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ minHeight: '44px', padding: '0 1rem', fontSize: '1rem', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}