import React from 'react';

export default function MinimalFooter() {
  return (
    <footer style={{ padding: '32px 24px', background: '#090d16', color: '#94a3b8', fontSize: '13px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontFamily: 'Calibre-R, sans-serif', fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>
          RESGUARDO DESIGNS
        </div>
        <p style={{ margin: 0, color: '#64748b' }}>
          Soluciones Gráficas, Cartelería & Logística B2B en Maryland, USA.
        </p>
        <div style={{ fontSize: '12px', color: '#475569' }}>
          © {new Date().getFullYear()} Resguardo Designs. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
