import React, { useState } from 'react';
import { Globe, Code, Copy, Eye, Zap, Sparkles, Check, Download, Layers, Search, Layout, Paintbrush, Award, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import CleanHero from './ui-blocks/heroes/CleanHero';
import VideoHero from './ui-blocks/heroes/VideoHero';
import FeatureBento from './ui-blocks/bentos/FeatureBento';
import LeadCaptureForm from './ui-blocks/forms/LeadCaptureForm';
import MinimalFooter from './ui-blocks/footers/MinimalFooter';

export default function AgileWebGenerator({ onNotification }) {
  const [activePhase, setActivePhase] = useState(1);
  const [clientUrl, setClientUrl] = useState('https://ejemplolocalmaryland.com');
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Master Copy JSON State
  const [masterCopy, setMasterCopy] = useState({
    hero: {
      headline: "Cartelería Comercial e Impresión de Gran Formato en Maryland",
      subheadline: "Transformamos la presencia de tu negocio con rótulos LED, vinilos microperforados y rotulación de vehículos de máxima durabilidad outdoor.",
      ctaText: "Solicitar Simulación 3D Gratis"
    },
    valueProps: [
      { title: "Materiales 3M de Grado Industrial", description: "Resistentes al sol y clima extremo de Maryland con garantía de 5 años." },
      { title: "Servicio Integrado Llave en Mano", description: "Diseño, fabricación rápida e instalación sin interrumpir tu negocio." },
      { title: "Garantía de Entrega en 72 Horas", description: "Producción acelerada para aperturas y renovaciones urgentes." }
    ],
    problemAgitation: {
      problemTitle: "¿Tu fachada o vehículos pasan desapercibidos en Maryland?",
      points: [
        "Un cartel desteñido o sin iluminación hace que clientes potenciales elijan a la competencia.",
        "Las camionetas sin rotular pierden más de 40.000 visualizaciones diarias en las autopistas.",
        "Presupuestos informales sin render previo generan sorpresas costosas."
      ]
    },
    socialProof: [
      { quote: "Resguardo transformó la fachada de nuestro restaurante en Silver Spring. Las consultas aumentaron un 35% el primer mes.", author: "Carlos M.", company: "El Sol Grill MD" },
      { quote: "Rotularon nuestras 5 vans de construcción en 3 días. Acabado impecable y durabilidad total.", author: "David K.", company: "Apex Roofing MD" }
    ],
    faq: [
      { question: "¿Cuánto tiempo toma la instalación?", answer: "La mayoría de instalaciones comerciales toman entre 4 y 8 horas una vez aprobado el diseño 3D." },
      { question: "¿Qué garantía tienen los vinilos en Maryland?", answer: "Ofrecemos garantía escrita de 5 años contra decoloración UV y desprendimiento." }
    ]
  });

  const [activeTheme, setActiveTheme] = useState('coda'); // 'coda', 'dark', 'corporate'
  const [selectedProposal, setSelectedProposal] = useState(1);
  const [copiedCode, setCopiedCode] = useState(false);

  // Maryland Competitors Mock Intelligence Data
  const competitors = [
    { name: "Maryland Signs & Banners", location: "Silver Spring", strength: "Precios bajos", weakness: "Diseños genéricos (AI Slop)", rating: "4.1" },
    { name: "Capital Wrap Pros", location: "Bethesda", strength: "Buena rotulación", weakness: "Tiempos lentos (3 semanas)", rating: "4.4" },
    { name: "Bayside Outdoor Graphics", location: "Baltimore", strength: "Muchos años", weakness: "Sitio web no responsive sin renders 3D", rating: "3.9" },
    { name: "Metro Signage Solutions", location: "Rockville", strength: "Letras LED", weakness: "Precios inflados", rating: "4.2" }
  ];

  const handleSimulateExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setExtractedData({
        bio: "Negocio familiar en Maryland dedicado al servicio de gastronomía y catering corporativo desde 2018.",
        painPoints: ["Fachada poco visible de noche", "Vehículo de entrega blanco sin logotipo", "Poca presencia de marca local"],
        praisingQuotes: ["La comida es excelente pero el local cuesta encontrarlo de noche", "Atención muy rápida"],
        tone: "Cercano, familiar, orientado a servicio de calidad"
      });
      if (onNotification) onNotification("Contexto extraído exitosamente desde la web del cliente.");
    }, 1200);
  };

  const getThemeStyles = () => {
    if (activeTheme === 'dark') {
      return { bg: '#090d16', text: '#ffffff', border: '#1e293b', accent: '#38bdf8' };
    }
    if (activeTheme === 'corporate') {
      return { bg: '#f8fafc', text: '#0f172a', border: '#cbd5e1', accent: '#2563eb' };
    }
    return { bg: '#ffffff', text: '#212121', border: '#8e8e8e', accent: '#212121' }; // Coda
  };

  const generateFullHTML = () => {
    const theme = getThemeStyles();
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resguardo Designs - ${masterCopy.hero.headline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --bg: ${theme.bg}; --text: ${theme.text}; --accent: ${theme.accent}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background-color: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    .hero { padding: 80px 0; text-align: center; border-bottom: 1px solid #e2e8f0; }
    .hero h1 { font-size: 44px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
    .hero p { font-size: 18px; color: #64748b; max-width: 680px; margin: 0 auto 28px; }
    .btn { display: inline-block; background-color: var(--accent); color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 60px 0; }
    .card { border: 1.5px inset #cbd5e1; border-radius: 12px; padding: 24px; background: #ffffff; }
    .card h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    footer { padding: 40px 0; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748b; }
  </style>
</head>
<body>
  <header style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
    <div className="container" style="display:flex; justify-content:space-between; align-items:center;">
      <strong style="font-size: 18px;">RESGUARDO DESIGNS</strong>
      <a href="#contacto" className="btn" style="padding: 8px 16px; font-size: 13px;">Cotizar Ahora</a>
    </div>
  </header>

  <section className="hero">
    <div className="container">
      <h1>${masterCopy.hero.headline}</h1>
      <p>${masterCopy.hero.subheadline}</p>
      <a href="#contacto" className="btn">${masterCopy.hero.ctaText}</a>
    </div>
  </section>

  <section className="container grid">
    ${masterCopy.valueProps.map(vp => `
      <div className="card">
        <h3>${vp.title}</h3>
        <p style="font-size: 14px; color: #64748b;">${vp.description}</p>
      </div>
    `).join('')}
  </section>

  <footer className="container">
    <p>&copy; ${new Date().getFullYear()} Resguardo Designs Maryland. Soluciones gráficas de alto nivel.</p>
  </footer>
</body>
</html>`.trim();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateFullHTML());
    setCopiedCode(true);
    if (onNotification) onNotification("Código HTML copiado al portapapeles.");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 5-Phase Pipeline Stepper */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {[
          { step: 1, title: 'Fase 1: Scraping & Contexto', icon: Search },
          { step: 2, title: 'Fase 2: Copy Master JSON', icon: Code },
          { step: 3, title: 'Fase 3: Enciclopedia UI', icon: Layout },
          { step: 4, title: 'Fase 4: Inteligencia Competitiva', icon: Award },
          { step: 5, title: 'Fase 5: Motor 6 Variantes', icon: Zap }
        ].map((item) => {
          const IconComp = item.icon;
          const isActive = activePhase === item.step;
          return (
            <button
              key={item.step}
              onClick={() => setActivePhase(item.step)}
              style={{
                background: isActive ? '#212121' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <IconComp size={16} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* PHASE 1: Scraping & Context Extraction */}
      {activePhase === 1 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Fase 1: Scraping & Extracción de Contexto del Cliente
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Ingresa la URL o red social del cliente en Maryland para extraer puntos de dolor, testimonios y tono del público objetivo.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="url"
              value={clientUrl}
              onChange={e => setClientUrl(e.target.value)}
              placeholder="https://restaurante-o-local-maryland.com"
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13.5px' }}
            />
            <button className="btn btn-primary" onClick={handleSimulateExtraction} disabled={isExtracting}>
              {isExtracting ? 'Analizando Sitio Web...' : 'Extraer Contexto & Reseñas'}
            </button>
          </div>

          {extractedData && (
            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Resumen Extraído del Cliente:</strong>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>{extractedData.bio}</p>
                
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block', marginTop: '12px' }}>Tono del Público:</strong>
                <span className="badge badge-blue">{extractedData.tone}</span>
              </div>

              <div>
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Puntos de Dolor Detectados:</strong>
                <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '18px', marginTop: '4px' }}>
                  {extractedData.painPoints.map((pt, idx) => <li key={idx}>{pt}</li>)}
                </ul>

                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => setActivePhase(2)}
                  style={{ marginTop: '14px', width: '100%', justifyContent: 'center' }}
                >
                  Avanzar a Fase 2: Inyectar en Copy Master JSON <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: Master Copy Document JSON */}
      {activePhase === 2 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                Fase 2: Documento Maestro de Copy (JSON Estructurado con Zod)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                La IA opera bajo un esquema estricto de JSON estructurado sin generar texto genérico descontextualizado ("No AI Slop").
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePhase(3)}>
              Siguiente: Fase 3 (Enciclopedia Componentes) <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Editor JSON Estructurado</label>
              <textarea 
                value={JSON.stringify(masterCopy, null, 2)}
                onChange={e => {
                  try {
                    setMasterCopy(JSON.parse(e.target.value));
                  } catch (err) {
                    // ignore syntax parse error while typing
                  }
                }}
                style={{ width: '100%', height: '360px', padding: '14px', fontFamily: 'monospace', fontSize: '12px', background: '#1e293b', color: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', height: '360px', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>Vista Previa de Valores Extraídos</h4>
              
              <div style={{ marginBottom: '14px' }}>
                <strong style={{ fontSize: '12px', color: '#64748b' }}>Headline Hero:</strong>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{masterCopy.hero.headline}</div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <strong style={{ fontSize: '12px', color: '#64748b' }}>Propuestas de Valor ({masterCopy.valueProps.length}):</strong>
                <ul style={{ fontSize: '12.5px', paddingLeft: '18px', margin: '4px 0 0 0' }}>
                  {masterCopy.valueProps.map((vp, idx) => (
                    <li key={idx}><strong>{vp.title}:</strong> {vp.description}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ fontSize: '12px', color: '#64748b' }}>Prueba Social:</strong>
                <div style={{ fontSize: '12px', fontStyle: 'italic', marginTop: '4px' }}>
                  "{masterCopy.socialProof[0]?.quote}" - {masterCopy.socialProof[0]?.author} ({masterCopy.socialProof[0]?.company})
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 3: Component Encyclopedia */}
      {activePhase === 3 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Fase 3: Enciclopedia de Componentes UI Curados
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Selección de bloques UI de alto impacto visual (CleanHero, VideoHero, FeatureBento, LeadCaptureForm, MinimalFooter).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ border: '1.5px inset var(--border-color)', padding: '14px', borderRadius: '10px', background: '#f8fafc' }}>
              <span className="badge badge-blue" style={{ marginBottom: '6px' }}>Heroes</span>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>CleanHero / VideoHero</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Encabezado limpio con micro-badge de durabilidad en Maryland.</p>
            </div>

            <div style={{ border: '1.5px inset var(--border-color)', padding: '14px', borderRadius: '10px', background: '#f8fafc' }}>
              <span className="badge badge-amber" style={{ marginBottom: '6px' }}>Bentos</span>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>FeatureBento 3M</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Grilla Bento para resaltar materiales, garantía y tiempos.</p>
            </div>

            <div style={{ border: '1.5px inset var(--border-color)', padding: '14px', borderRadius: '10px', background: '#f8fafc' }}>
              <span className="badge badge-green" style={{ marginBottom: '6px' }}>Formularios</span>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>LeadCaptureForm</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Captura de leads B2B con selector de tipo de proyecto.</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePhase(4)}>
              Avanzar a Inteligencia Competitiva <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 4: Visual Competitive Intelligence */}
      {activePhase === 4 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Fase 4: Inteligencia Competitiva Visual (Maryland Local Businesses)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Auditoría visual de 20 competidores locales para superar sus puntos débiles en las 6 propuestas multivariante.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {competitors.map((comp, i) => (
              <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', background: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '13px' }}>{comp.name}</strong>
                  <span className="badge badge-blue">{comp.rating} ★</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 {comp.location}, MD</div>
                <div style={{ fontSize: '11.5px', marginTop: '8px', color: '#166534' }}>✓ {comp.strength}</div>
                <div style={{ fontSize: '11.5px', color: '#991b1b' }}>✗ {comp.weakness}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary btn-sm" onClick={() => setActivePhase(5)}>
              Generar Motor de 6 Variantes Multivariante <Zap size={14} />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 5: 6-Variant Proposal Engine & Theme Switcher */}
      {activePhase === 5 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                Fase 5: Motor Multivariante (6 Propuestas de Alto Gusto)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                3 propuestas basadas en la idea directa + 3 propuestas diseñadas para superar a la competencia local.
              </p>
            </div>

            {/* Theme Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', paddingLeft: '8px' }}>Tema:</span>
              <button 
                className={`btn btn-xs ${activeTheme === 'coda' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTheme('coda')}
              >
                Coda Monocromático
              </button>
              <button 
                className={`btn btn-xs ${activeTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTheme('dark')}
              >
                Dark Industrial
              </button>
              <button 
                className={`btn btn-xs ${activeTheme === 'corporate' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTheme('corporate')}
              >
                Accent Corporativo
              </button>
            </div>
          </div>

          {/* Proposal Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedProposal(num)}
                className={`btn btn-sm ${selectedProposal === num ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexShrink: 0 }}
              >
                {num <= 3 ? `Propuesta Directa #${num}` : `Superar Competencia #${num}`}
              </button>
            ))}
          </div>

          {/* Render Active Proposal Component Stack */}
          <div style={{ border: '1.5px inset var(--border-color)', borderRadius: '12px', overflow: 'hidden', background: getThemeStyles().bg }}>
            {selectedProposal % 2 === 0 ? (
              <VideoHero copy={masterCopy.hero} />
            ) : (
              <CleanHero copy={masterCopy.hero} />
            )}
            
            <FeatureBento valueProps={masterCopy.valueProps} />
            <LeadCaptureForm />
            <MinimalFooter />
          </div>

          {/* Export Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleCopyCode}>
              {copiedCode ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
              {copiedCode ? 'Código HTML Copiado' : 'Copiar HTML Standalone'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
