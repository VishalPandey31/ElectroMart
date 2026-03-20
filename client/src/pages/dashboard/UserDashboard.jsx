import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard/orders', icon: '📦', label: 'My Orders', desc: 'Track your purchases' },
  { to: '/dashboard/profile', icon: '👤', label: 'My Profile', desc: 'Personal information' },
  { to: '/dashboard/addresses', icon: '📍', label: 'Addresses', desc: 'Saved delivery addresses' },
  { to: '/dashboard/wishlist', icon: '❤️', label: 'Wishlist', desc: 'Saved items' },
]

const UserDashboard = () => {
  const { user, logout } = useAuth()

  return (
    <div style={{ background: '#080b14', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: '#0c1520', borderBottom: '1px solid #1e2530', padding: '10px 0' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <span style={{ color: '#e8eef5' }}>My Account</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 20px', display: 'grid', gridTemplateColumns: '270px 1fr', gap: 22, alignItems: 'start' }}>

        {/* ── Sidebar ── */}
        <aside>
          {/* Profile card */}
          <div style={{
            background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12,
            overflow: 'hidden', marginBottom: 14,
          }}>
            {/* Gradient banner */}
            <div style={{ height: 64, background: 'linear-gradient(135deg, #1a2d50 0%, #0e1a38 100%)' }} />
            <div style={{ padding: '0 18px 20px', marginTop: -32 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2874f0, #8957e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 900, color: '#fff',
                border: '3px solid #0d1117', marginBottom: 12,
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e8eef5', marginBottom: 2 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: '#6e7681', marginBottom: 8 }}>{user?.email}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(40,116,240,0.1)', border: '1px solid rgba(40,116,240,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 11.5, color: '#4da8ff', fontWeight: 700 }}>
                {user?.role === 'admin' ? '👑 Admin' : '🛍️ Customer'}
              </div>
            </div>
          </div>

          {/* Nav cards */}
          <div style={{ background: '#0d1117', border: '1px solid #1e2530', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            {NAV_ITEMS.map((item, i) => (
              <NavLink key={item.to} to={item.to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 18px',
                  borderBottom: i < NAV_ITEMS.length - 1 ? '1px solid #1a2030' : 'none',
                  background: isActive ? 'rgba(40,116,240,0.08)' : 'transparent',
                  borderLeft: isActive ? '3px solid #2874f0' : '3px solid transparent',
                  transition: 'all 0.15s',
                })}
                onMouseEnter={e => { if (!e.currentTarget.style.borderLeftColor.includes('40,116,240')) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                onMouseLeave={e => { if (!e.currentTarget.style.borderLeftColor.includes('40,116,240')) e.currentTarget.style.background = 'transparent' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#c9d1d9' }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: '#4d5562' }}>{item.desc}</div>
                </div>
              </NavLink>
            ))}
          </div>

          {/* Admin link */}
          {user?.role === 'admin' && (
            <Link to="/admin"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'rgba(240,136,62,0.08)', border: '1px solid rgba(240,136,62,0.2)', borderRadius: 10, marginBottom: 10, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,136,62,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,136,62,0.08)'}>
              <span style={{ fontSize: 18 }}>🔧</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f0883e' }}>Admin Panel</div>
                <div style={{ fontSize: 11.5, color: '#6e7681' }}>Manage products & orders</div>
              </div>
            </Link>
          )}

          {/* Logout */}
          <button onClick={logout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 18px', background: 'rgba(248,81,73,0.06)',
              border: '1px solid rgba(248,81,73,0.15)', borderRadius: 10,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,81,73,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(248,81,73,0.06)'}>
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f85149' }}>Sign Out</span>
          </button>
        </aside>

        {/* ── Content ── */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
