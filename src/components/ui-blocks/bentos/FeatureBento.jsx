import React from 'react';
import { Shield, Sparkles, Truck, Award, Layers, Clock } from 'lucide-react';

export default function FeatureBento({ valueProps = [] }) {
  const defaultProps = [
    { title: 'Materiales 3M de Grado Industrial', description: 'Garantizados contra decoloración solar por más de 5 años en Maryland.', icon: Shield },
    { title: 'Servicio Llave en Mano', description: 'Nos encargamos de medición, diseño en 3D, impresión e instalación.', icon: Layers },
    { title: 'Entregas Rápidas en 48-72h', description: 'Tiempos de producción acelerados para aperturas de locales urgentes.', icon: Clock },
    { title: 'Rotulación de Flotas 3D', description: 'Ajuste perfecto a curvas sin burbujas ni desgaste en parachoques.', icon: Truck }
  ];

  const items = valueProps.length > 0 ? valueProps : defaultProps;

  return (
    <section style={{ padding: '64px 24px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Calibre-R, sans-serif', fontSize: '32px', fontWeight: '700', color: '#0f172a' }}>
            ¿Por qué los mejores comercios de Maryland eligen Resguardo?
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '8px' }}>
            Ingeniería de materiales, impresión de alta resolución y acabados impecables.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {items.map((item, index) => (
            <div 
              key={index}
              style={{
                background: '#ffffff',
                border: '1.5px inset #e2e8f0',
                borderRadius: '14px',
                padding: '24px',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Shield size={22} color="#0f172a" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: '1.5' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
