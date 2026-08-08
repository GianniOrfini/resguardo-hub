import React from 'react';
import { Play, CheckCircle2 } from 'lucide-react';

export default function VideoHero({ copy = {} }) {
  const { headline, subheadline, ctaText } = copy;

  return (
    <section style={{ padding: '72px 24px', background: '#090d16', color: '#ffffff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '11px', fontWeight: '700', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '6px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '18px' }}>
          Instalación Profesional en Maryland
        </span>

        <h1 style={{ fontFamily: 'Calibre-R, sans-serif', fontSize: '48px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '20px' }}>
          {headline || 'Lleva la Imagen de tu Empresa al Siguiente Nivel'}
        </h1>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#94a3b8', maxWidth: '640px', margin: '0 auto 32px', lineHeight: '1.6' }}>
          {subheadline || 'Mira nuestro proceso de instalación de rotulación vehicular 3M y marquesinas de alta resolución.'}
        </p>

        {/* Video Placeholder Container */}
        <div style={{ background: '#1e293b', border: '1.5px solid #334155', borderRadius: '16px', height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}>
            <Play size={26} color="#0f172a" style={{ marginLeft: '4px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <a href="#contacto" style={{ background: '#38bdf8', color: '#090d16', padding: '14px 32px', borderRadius: '10px', fontWeight: '700', textDecoration: 'none' }}>
            {ctaText || 'Cotizar Proyecto Ahora'}
          </a>
        </div>
      </div>
    </section>
  );
}
