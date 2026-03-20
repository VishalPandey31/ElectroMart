// PageLoader
export function PageLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 14 }}>
      <div style={{ width: 42, height: 42, border: '3.5px solid #e0e0e0', borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <span style={{ color: '#888', fontSize: 13 }}>Loading...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Skeleton card for product grids
export function SkeletonCard() {
  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1' }} />
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div className="skeleton" style={{ height: 9, width: '38%', borderRadius: 3 }} />
        <div className="skeleton" style={{ height: 12, width: '92%', borderRadius: 3 }} />
        <div className="skeleton" style={{ height: 12, width: '68%', borderRadius: 3 }} />
        <div className="skeleton" style={{ height: 16, width: '48%', borderRadius: 3, marginTop: 2 }} />
        <div className="skeleton" style={{ height: 33, width: '100%', borderRadius: 3, marginTop: 4 }} />
      </div>
    </div>
  )
}

// Inline mini spinner
export function Spinner({ size = 18 }) {
  return (
    <>
      <div style={{ width: size, height: size, border: `2px solid #e0e0e0`, borderTopColor: '#2874f0', borderRadius: '50%', animation: 'spin .8s linear infinite', flexShrink: 0 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
