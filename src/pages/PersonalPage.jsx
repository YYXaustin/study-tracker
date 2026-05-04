export default function PersonalPage() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Personal Data</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: 32 }}>Your profile and preferences.</p>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '32px',
        color: 'var(--text-dim)', fontSize: '0.9rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: '3rem' }}>🚧</div>
        <p>Personal data settings coming soon.</p>
      </div>
    </div>
  )
}