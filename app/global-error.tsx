'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 32, fontFamily: 'sans-serif' }}>
        <h1>⚠️ Something went wrong</h1>
        <p>{error?.message}</p>
        <button
          onClick={() => reset()}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginTop: 16,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
