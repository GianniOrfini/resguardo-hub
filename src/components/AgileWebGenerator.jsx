import React, { useState } from 'react';
import { Globe, Code, Copy, Eye, Zap, Sparkles, Check, Download, Layers } from 'lucide-react';

export default function AgileWebGenerator({ onNotification }) {
  const [businessName, setBusinessName] = useState('Resguardo Graphic Designs');
  const [tagline, setTagline] = useState('Cartelería Comercial y Logística de Distribución en Maryland');
  const [phone, setPhone] = useState('(301) 555-0199');
  const [primaryColor, setPrimaryColor] = useState('#212121');
  const [selectedBlocks, setSelectedBlocks] = useState(['hero', 'features', 'form', 'footer']);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewTab, setViewTab] = useState('preview');

  const availableBlocks = [
    { id: 'hero', name: 'Sección Hero Principal', desc: 'Encabezado con título, subtítulo y botón CTA principal' },
    { id: 'features', name: 'Grilla de Servicios / Cartelería', desc: 'Tarjetas visuales para Rótulos LED, Vinilos y Logística' },
    { id: 'form', name: 'Formulario de Captura GoHighLevel', desc: 'Formulario integrado para solicitud de cotización' },
    { id: 'faq', name: 'Preguntas Frecuentes (FAQ)', desc: 'Desplegables de preguntas comunes de clientes' },
    { id: 'footer', name: 'Pie de Página Corporativo', desc: 'Derechos reservados, teléfono y enlaces' }
  ];

  const toggleBlock = (id) => {
    if (selectedBlocks.includes(id)) {
      setSelectedBlocks(selectedBlocks.filter(b => b !== id));
    } else {
      setSelectedBlocks([...selectedBlocks, id]);
    }
  };

  const generateHTMLCode = () => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} - ${tagline}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; color: #1a1a1a; background-color: #ffffff; line-height: 1.6; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    .btn { display: inline-block; background-color: ${primaryColor}; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; transition: 0.2s ease; }
    .btn:hover { opacity: 0.9; }
    header { border-bottom: 1px solid #e5e7eb; padding: 20px 0; }
    .nav { display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 20px; font-weight: 800; color: ${primaryColor}; }
    .hero { padding: 80px 0; text-align: center; background: #f8fafc; border-bottom: 1px solid #e5e7eb; }
    .hero h1 { font-size: 42px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
    .hero p { font-size: 18px; color: #4b5563; max-width: 700px; margin: 0 auto 30px; }
    .features { padding: 80px 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 40px; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; background: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .card h3 { font-size: 18px; margin-bottom: 10px; }
    .card p { color: #6b7280; font-size: 14px; }
    .form-sec { padding: 80px 0; background: #111827; color: #ffffff; text-align: center; }
    .form-sec h2 { font-size: 32px; margin-bottom: 16px; }
    .form-box { max-width: 500px; margin: 30px auto 0; background: #ffffff; padding: 30px; border-radius: 12px; color: #1a1a1a; text-align: left; }
    footer { padding: 40px 0; text-align: center; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>

  <header>
    <div class="container nav">
      <div class="logo">${businessName}</div>
      <a href="tel:${phone}" className="btn" style="padding: 8px 16px; font-size: 14px;">Llamar: ${phone}</a>
    </div>
  </header>

${selectedBlocks.includes('hero') ? `
  <section className="hero">
    <div className="container">
      <h1>${tagline}</h1>
      <p>Soluciones exprés en impresión de gran formato, letreros luminosos y soporte logístico en Maryland, US.</p>
      <a href="#contacto" className="btn">Solicitar Cotización Inmediata</a>
    </div>
  </section>
` : ''}

${selectedBlocks.includes('features') ? `
  <section className="features">
    <div className="container">
      <h2 style="text-align: center; font-size: 30px; font-weight: 800;">Nuestros Servicios Principales</h2>
      <div className="grid">
        <div className="card">
          <h3>Cartelería Comercial & LED</h3>
          <p>Fabricación e instalación de rótulos luminosos, cajas de luz y letreros 3D para fachadas comerciales.</p>
        </div>
        <div className="card">
          <h3>Vinilos & Rotulación de Flotas</h3>
          <p>Impresión de alta resolución para escaparates, vehículos corporativos y ferias comerciales.</p>
        </div>
        <div className="card">
          <h3>Logística de Distribución</h3>
          <p>Almacenamiento y transporte eficiente para empresas locales en la región de Maryland.</p>
        </div>
      </div>
    </div>
  </section>
` : ''}

${selectedBlocks.includes('form') ? `
  <section id="contacto" className="form-sec">
    <div className="container">
      <h2>Pide tu Maqueta Digital o Cotización</h2>
      <p style="color: #9ca3af;">Completa el formulario y nos pondremos en contacto en menos de 2 horas.</p>
      <div className="form-box">
        <form onsubmit="alert('Solicitud enviada a GoHighLevel!'); return false;">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 600; font-size: 13px; margin-bottom: 4px;">Nombre Completo</label>
            <input type="text" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db;" placeholder="Tu nombre...">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 600; font-size: 13px; margin-bottom: 4px;">Correo Electrónico</label>
            <input type="email" required style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid #d1d5db;" placeholder="correo@empresa.com">
          </div>
          <button type="submit" class="btn" style="width: 100%; cursor: pointer;">Enviar Solicitud</button>
        </form>
      </div>
    </div>
  </section>
` : ''}

${selectedBlocks.includes('footer') ? `
  <footer>
    <div className="container">
      <p>&copy; ${new Date().getFullYear()} ${businessName}. Todos los derechos reservados. Maryland, US.</p>
    </div>
  </footer>
` : ''}

</body>
</html>`.trim();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateHTMLCode());
    setCopiedCode(true);
    onNotification('Código HTML de la Landing Page copiado al portapapeles.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadHTML = () => {
    const code = generateHTMLCode();
    const dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(code);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `landing_${businessName.toLowerCase().replace(/\s+/g, '_')}.html`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onNotification('Archivo HTML descargado listo para desplegar.');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
      {/* Left Config Controls */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '800', fontFamily: 'var(--font-heading)', fontSize: '15px' }}>
          <Zap size={18} style={{ color: 'var(--accent-amber)' }} /> Configuración Exprés
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700' }}>Nombre de la Empresa</label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700' }}>Titular Principal (Tagline)</label>
          <textarea
            rows={2}
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12.5px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700' }}>Teléfono de Contacto</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700' }}>Color Principal de Marca</label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="color"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            />
            <input
              type="text"
              value={primaryColor}
              onChange={e => setPrimaryColor(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'block' }}>
            Bloques Activos
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableBlocks.map(b => (
              <label
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '12.5px',
                  padding: '8px 10px',
                  background: selectedBlocks.includes(b.id) ? '#f1f5f9' : '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedBlocks.includes(b.id)}
                  onChange={() => toggleBlock(b.id)}
                />
                <div>
                  <div style={{ fontWeight: '600' }}>{b.name}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleDownloadHTML}>
            <Download size={15} /> Descargar HTML Completo
          </button>
          <button className="btn btn-secondary" onClick={handleCopyCode}>
            {copiedCode ? <Check size={15} color="var(--accent-green)" /> : <Copy size={15} />}
            {copiedCode ? 'Código Copiado' : 'Copiar HTML al Portapapeles'}
          </button>
        </div>
      </div>

      {/* Right Render & Code View */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${viewTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewTab('preview')}
            >
              <Eye size={14} /> Vista Previa En Vivo (Iframe)
            </button>
            <button
              className={`btn btn-sm ${viewTab === 'code' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewTab('code')}
            >
              <Code size={14} /> Código Fuente HTML
            </button>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Construcción en &lt; 3 minutos
          </span>
        </div>

        {viewTab === 'preview' ? (
          <div style={{ flex: 1, minHeight: '500px', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', background: '#ffffff' }}>
            <iframe
              srcDoc={generateHTMLCode()}
              title="Preview Landing Page"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        ) : (
          <textarea
            readOnly
            value={generateHTMLCode()}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '500px',
              padding: '16px',
              borderRadius: '10px',
              fontFamily: 'monospace',
              fontSize: '12px',
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid var(--border-color)'
            }}
          />
        )}
      </div>
    </div>
  );
}
