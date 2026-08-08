import React from 'react';
import { ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function CleanHero({ copy = {} }) {
  const { headline, subheadline, ctaText } = copy;

  return (
    <section style={{ padding: '64px 24px', background: 'var(--bg-main, #ffffff)', textAlignment: 'center', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '20px' }}>
          <ShieldCheck size={14} color="#0f172a" />
          <span>Garantía de Durabilidad Outdoor en Maryland</span>
        </div>

        <h1 style={{ fontFamily: 'Calibre-R, sans-serif', fontSize: '46px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-1.5px', color: '#111827', marginBottom: '18px' }}>
          {headline || 'Cartelería y Presencia Visual Imponente para tu Comercio'}
        </h1>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '500', lineHeight: '1.6', color: '#475569', marginBottom: '28px', maxWidth: '680px', marginInline: 'auto' }}>
          {subheadline || 'Transformamos la fachada y vehículos de tu negocio en imanes de clientes locales con vinilos, marquesinas y letras corpóreas de máxima durabilidad.'}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <a href="#contacto" style={{ background: '#111827', color: '#ffffff', padding: '14px 28px', borderRadius: '10px', fontWeight: '600', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>{ctaText || 'Solicitar Cotización Inmediata'}</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '36px', fontSize: '13px', color: '#64748b' }}>
          <div style={{ display: 'flex', color: '#f59e0b' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#f59e0b" />)}
          </div>
          <span><strong>4.9/5 estrellas</strong> en Maryland por más de 120 locales comerciales</span>
        </div>
      </div>
    </section>
  );
}
