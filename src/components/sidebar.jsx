const NAV_ITEMS = [
  { id: 'home',    icon: '⌂',  label: 'Home'     },
  { id: 'records', icon: '📋', label: 'Records'  },
  { id: 'profile', icon: '👤', label: 'Personal' },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={{
      width: 220, minWidth: 220,
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '16px 0', height: '100%', overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '12px 20px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', color: '#0d0d0f', fontWeight: 800,
        }}>S</div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
          Study Tracker
        </span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {NAV_ITEMS.map(item => {
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 8, border: 'none',
                background: active ? 'var(--surface2)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                textAlign: 'left', transition: 'background 0.15s, color 0.15s',
                cursor: 'pointer', width: '100%',
              }}
            >
              <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {active && (
                <span style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />
              )}
            </button>
          )
        })}
      </nav>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '16px 20px', fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
        More features coming soon.
      </div>
    </aside>
  )
}