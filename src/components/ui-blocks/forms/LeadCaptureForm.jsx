import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function LeadCaptureForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', projectType: 'Cartelería Fachada' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" style={{ padding: '64px 24px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto', background: '#ffffff', border: '1.5px inset #cbd5e1', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontFamily: 'Calibre-R, sans-serif', fontSize: '26px', fontWeight: '700', color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>
          Solicita tu Cotización & Simulación Visual 3D
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
          Completa los datos y un especialista en Maryland te responderá en menos de 2 horas.
        </p>

        {submitted ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '10px', textAlign: 'center', color: '#166534' }}>
            <CheckCircle2 size={32} style={{ margin: '0 auto 10px' }} />
            <strong style={{ fontSize: '16px', display: 'block' }}>¡Solicitud Recibida con Éxito!</strong>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>Gianni o Ana del equipo de Resguardo se pondrán en contacto contigo en breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Nombre / Negocio *</label>
              <input 
                type="text" 
                required 
                placeholder="Ej. Restaurante El Sol / Carlos Ruiz"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Teléfono *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="(301) 555-0199"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Correo Electrónico *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="carlos@negocio.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginTop: '4px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Tipo de Proyecto</label>
              <select 
                value={formData.projectType}
                onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', marginTop: '4px' }}
              >
                <option>Cartelería Fachada Exterior</option>
                <option>Vinilo Microperforado Ventanales</option>
                <option>Rotulación de Vehículo / Camioneta</option>
                <option>Letras Corpóreas LED</option>
                <option>Otro Proyecto Gráfico</option>
              </select>
            </div>

            <button 
              type="submit" 
              style={{ background: '#0f172a', color: '#ffffff', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}
            >
              <Send size={16} /> Enviar Solicitud de Cotización
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
