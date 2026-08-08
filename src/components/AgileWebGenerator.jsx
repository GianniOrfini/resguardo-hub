import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { generateIrresistibleOffer, generateBuyerPersona, generateSkeletonStructure, inferDesignDials } from '../utils/promptEngine';
import CleanHero from './ui-blocks/heroes/CleanHero';
import VideoHero from './ui-blocks/heroes/VideoHero';
import FeatureBento from './ui-blocks/bentos/FeatureBento';
import LeadCaptureForm from './ui-blocks/forms/LeadCaptureForm';
import MinimalFooter from './ui-blocks/footers/MinimalFooter';
import { 
  Globe, Code, Copy, Eye, Zap, Sparkles, Check, Download, Layers, Search, Layout, 
  Award, ArrowRight, ShieldCheck, Plus, Trash2, ArrowLeft, Wand2, FileText, CheckCircle2, UserCheck, RefreshCw, BookOpen
} from 'lucide-react';

export default function AgileWebGenerator({ onNotification }) {
  // Websites Gallery query from Dexie
  const websitesList = useLiveQuery(() => db.websites.toArray(), []) || [];
  const uiReferences = useLiveQuery(() => db.uiReferences.toArray(), []) || [];

  // Workspace Mode: 'gallery' or 'editor'
  const [viewMode, setViewMode] = useState('gallery'); 
  const [activeWebId, setActiveWebId] = useState(null);

  // Editor State & Stepper (1: Client Info, 2: Conceptual Subagents, 3: Skeleton, 4: UI Encyclopedia Direction, 5: Multivariant Google Stitch)
  const [editorStep, setEditorStep] = useState(1);

  // Project Inputs
  const [clientName, setClientName] = useState('');
  const [clientUrl, setClientUrl] = useState('');
  const [industry, setIndustry] = useState('Restaurantes & Gastronomía');
  const [currentPain, setCurrentPain] = useState('Fachada anticuada y poco visible de noche');

  // Generated Conceptual Subagent Outputs
  const [offerData, setOfferData] = useState(null);
  const [personaData, setPersonaData] = useState(null);
  const [skeletonData, setSkeletonData] = useState(null);

  // Design Direction & Multivariant State
  const [selectedVibe, setSelectedVibe] = useState('Coda Monocromático');
  const [selectedProposal, setSelectedProposal] = useState(1);
  const [copiedCode, setCopiedCode] = useState(false);
  const [renderMode, setRenderMode] = useState('visual'); // 'visual' or 'code'

  // Open New Web Creation Wizard
  const handleStartNewProject = () => {
    setActiveWebId(null);
    setClientName('Nuevo Cliente Maryland');
    setClientUrl('https://cliente-ejemplo-md.com');
    setIndustry('Comercio Físico');
    setCurrentPain('Falta de presencia nocturna y camioneta sin rotular');
    setOfferData(null);
    setPersonaData(null);
    setSkeletonData(null);
    setEditorStep(1);
    setViewMode('editor');
  };

  // Open Existing Web Project
  const handleOpenProject = (web) => {
    setActiveWebId(web.id);
    setClientName(web.clientName || web.name);
    setOfferData(generateIrresistibleOffer({ clientName: web.clientName }));
    setPersonaData(generateBuyerPersona({ location: 'Maryland' }));
    setSkeletonData(generateSkeletonStructure({ offer: generateIrresistibleOffer({ clientName: web.clientName }), persona: generateBuyerPersona({ location: 'Maryland' }) }));
    setSelectedVibe(web.vibe || 'Coda Monocromático');
    setEditorStep(5); // Jump straight to Finished Multivariant Proposals
    setViewMode('editor');
  };

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation();
    await db.websites.delete(id);
    if (onNotification) onNotification('Proyecto web eliminado.');
  };

  // Run Conceptual Subagents Step 2
  const handleRunSubagents = () => {
    const offer = generateIrresistibleOffer({ clientName, industry, currentPain });
    const persona = generateBuyerPersona({ industry, location: 'Maryland' });
    const skeleton = generateSkeletonStructure({ offer, persona });

    setOfferData(offer);
    setPersonaData(persona);
    setSkeletonData(skeleton);
    setEditorStep(2);
    if (onNotification) onNotification('Subagentes de Propuesta e Identificación de Persona ejecutados.');
  };

  // Save Web Project to DB
  const handleSaveWebToDB = async (status = 'Borrador') => {
    if (activeWebId) {
      await db.websites.update(activeWebId, {
        name: clientName,
        clientName,
        status,
        updatedAt: new Date().toISOString().slice(0, 10),
        vibe: selectedVibe
      });
      if (onNotification) onNotification('Proyecto web actualizado en la galería.');
    } else {
      const newId = await db.websites.add({
        name: `${clientName} - Landing Page`,
        clientName,
        status,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        vibe: selectedVibe
      });
      setActiveWebId(newId);
      if (onNotification) onNotification('Nuevo proyecto web guardado en la galería.');
    }
  };

  const generateFullHTML = () => {
    const themeBg = selectedVibe === 'Dark Industrial' ? '#090d16' : selectedVibe === 'Accent Corporativo' ? '#f8fafc' : '#ffffff';
    const themeText = selectedVibe === 'Dark Industrial' ? '#ffffff' : '#212121';
    const themeAccent = selectedVibe === 'Dark Industrial' ? '#38bdf8' : selectedVibe === 'Accent Corporativo' ? '#2563eb' : '#212121';

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resguardo Designs - ${clientName}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root { --bg: ${themeBg}; --text: ${themeText}; --accent: ${themeAccent}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background-color: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    header { padding: 20px 0; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .btn { display: inline-block; background-color: var(--accent); color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; }
    .hero { padding: 80px 0; text-align: center; border-bottom: 1px solid #e2e8f0; }
    .hero h1 { font-size: 44px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
    .hero p { font-size: 18px; opacity: 0.85; max-width: 680px; margin: 0 auto 28px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; padding: 60px 0; }
    .card { border: 1.5px inset #cbd5e1; border-radius: 12px; padding: 24px; background: rgba(255,255,255,0.03); }
    .form-box { max-width: 500px; margin: 40px auto; padding: 32px; border: 1.5px inset #cbd5e1; border-radius: 16px; background: #ffffff; color: #111827; }
    footer { padding: 40px 0; text-align: center; border-top: 1px solid #e2e8f0; font-size: 13px; opacity: 0.7; }
  </style>
</head>
<body>
  <div className="container">
    <header>
      <strong style="font-size: 18px;">RESGUARDO DESIGNS</strong>
      <a href="#contacto" className="btn" style="padding: 8px 16px; font-size: 13px;">Cotizar Ahora</a>
    </header>

    <section className="hero">
      <h1>${offerData?.tagline || 'Cartelería y Presencia Visual en Maryland'}</h1>
      <p>${offerData?.coreOffer || 'Transformamos la imagen de tu comercio con rotulación 3M y marquesinas LED.'}</p>
      <a href="#contacto" className="btn">${offerData?.callToAction || 'Solicitar Cotización'}</a>
    </section>

    <section className="grid">
      ${(offerData?.benefits || []).map(b => `
        <div className="card">
          <h3>Beneficio Directo</h3>
          <p style="font-size: 14px; opacity: 0.8;">${b}</p>
        </div>
      `).join('')}
    </section>

    <section id="contacto" className="form-box">
      <h3 style="text-align: center; font-size: 22px; margin-bottom: 6px;">Solicita tu Cotización 3D</h3>
      <form onsubmit="alert('Solicitud enviada a Resguardo Designs'); return false;">
        <div style="margin-bottom: 12px;">
          <label style="display:block; font-size:12px; font-weight:700;">Nombre / Negocio *</label>
          <input type="text" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #cbd5e1;">
        </div>
        <button type="submit" className="btn" style="width: 100%;">Enviar Solicitud</button>
      </form>
    </section>

    <footer>
      <p>&copy; ${new Date().getFullYear()} Resguardo Designs Maryland. Todos los derechos reservados.</p>
    </footer>
  </div>
</body>
</html>`.trim();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateFullHTML());
    setCopiedCode(true);
    if (onNotification) onNotification('Código HTML copiado al portapapeles.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadHTML = () => {
    const code = generateFullHTML();
    const dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(code);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `landing_${clientName.toLowerCase().replace(/\s+/g, '_')}_propuesta_${selectedProposal}.html`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (onNotification) onNotification('Archivo HTML listo para producción descargado.');
  };

  // RENDER 1: WEBSITES GALLERY (Main Dashboard View)
  if (viewMode === 'gallery') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Globe size={24} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '700', margin: 0 }}>
                Galería de Landing Pages & Websites Creados
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Gestiona tus proyectos web creados, edita estructuras o crea una nueva landing page ágil sin "AI Slop".
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleStartNewProject}>
            <Plus size={16} /> Crear Nueva Landing Page
          </button>
        </div>

        {/* Websites Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Card Vacía para Crear Nuevo Proyecto */}
          <div 
            onClick={handleStartNewProject}
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '32px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: '#f8fafc',
              transition: 'var(--transition-fast)',
              minHeight: '220px'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Plus size={24} color="var(--accent-primary)" />
            </div>
            <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>+ Nueva Web Ágil</strong>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px', margin: 0 }}>
              Iniciar proceso conceptual, subagentes y generador multivariante
            </p>
          </div>

          {/* Tarjetas de Sitios Existentes */}
          {websitesList.map((web) => (
            <div
              key={web.id}
              onClick={() => handleOpenProject(web)}
              style={{
                background: '#ffffff',
                border: '1.5px inset var(--border-color)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                minHeight: '220px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className={`badge ${web.status === 'Publicado' ? 'badge-green' : 'badge-amber'}`}>
                    {web.status}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{web.updatedAt}</span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                  {web.name}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Cliente: <strong>{web.clientName}</strong>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px' }}>
                  Estilo: {web.vibe || 'Coda Monocromático'}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Abrir Proyecto <ArrowRight size={14} />
                </span>

                <button 
                  onClick={(e) => handleDeleteProject(web.id, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  title="Eliminar proyecto"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // RENDER 2: WORKSPACE EDITOR (5-Step Creation & Optimization Wizard)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Controls Bar */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setViewMode('gallery')}>
            <ArrowLeft size={15} /> Volver a Galería
          </button>
          <strong style={{ fontSize: '16px', fontFamily: 'var(--font-heading)' }}>
            Proyecto: {clientName || 'Nuevo Cliente'}
          </strong>
        </div>

        {/* Stepper Navigation */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { step: 1, label: '1. Info Cliente', icon: FileText },
            { step: 2, label: '2. Subagentes', icon: Wand2 },
            { step: 3, label: '3. Esqueleto', icon: Layers },
            { step: 4, label: '4. Dirección UI', icon: BookOpen },
            { step: 5, label: '5. Google Stitch', icon: Zap }
          ].map((st) => {
            const IconComp = st.icon;
            const isActive = editorStep === st.step;
            return (
              <button
                key={st.step}
                onClick={() => setEditorStep(st.step)}
                style={{
                  background: isActive ? '#212121' : '#f1f5f9',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <IconComp size={14} />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CLIENT INFORMATIONAL INPUT & QUESTIONS */}
      {editorStep === 1 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Paso 1: Obtener Información & Formulario del Cliente
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Ingresa los datos generales del cliente o local comercial en Maryland para alimentar los subagentes conceptuales.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Nombre del Negocio / Cliente *</label>
              <input 
                type="text" 
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Ej. El Sol Grill / Apex Roofing MD"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13.5px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>URL del Sitio Actual o Red Social</label>
              <input 
                type="url" 
                value={clientUrl}
                onChange={e => setClientUrl(e.target.value)}
                placeholder="https://ejemplo-cliente.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13.5px', marginTop: '4px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Rubro / Industria</label>
              <select 
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13.5px', marginTop: '4px' }}
              >
                <option>Restaurantes & Gastronomía</option>
                <option>Contratistas & Servicios de Construcción</option>
                <option>Tiendas Retail & Locales Físicos</option>
                <option>Servicios Corporativos B2B</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Problema de Imagen Detectado</label>
              <input 
                type="text" 
                value={currentPain}
                onChange={e => setCurrentPain(e.target.value)}
                placeholder="Ej. Poca visibilidad nocturna / Camionetas sin rotular"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13.5px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={handleRunSubagents}>
              Ejecutar Subagentes Conceptuales <Wand2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CONCEPTUAL SUBAGENTS (OFFER & BUYER PERSONA) */}
      {editorStep === 2 && offerData && personaData && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Paso 2: Subagentes Conceptuales Especializados (taste-SKILL.md)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Definición de la propuesta de valor irresistible y perfil del comprador antes de tocar cualquier elemento de diseño visual.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Subagent 1: Irresistible Offer */}
            <div style={{ background: '#f8fafc', border: '1.5px inset var(--border-color)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Sparkles size={18} color="var(--accent-amber)" />
                <strong style={{ fontSize: '15px' }}>Subagente: Propuesta Irresistible</strong>
              </div>

              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{offerData.title}</div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>{offerData.coreOffer}</p>

              <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}>
                <strong>Garantía Anti-Riesgo:</strong> {offerData.guarantee}
              </div>
            </div>

            {/* Subagent 2: Buyer Persona */}
            <div style={{ background: '#f8fafc', border: '1.5px inset var(--border-color)', borderRadius: '12px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <UserCheck size={18} color="#2563eb" />
                <strong style={{ fontSize: '15px' }}>Subagente: Buyer Persona Maryland</strong>
              </div>

              <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{personaData.personaTitle}</div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>{personaData.demographics}</p>

              <div style={{ fontSize: '12px' }}>
                <strong style={{ color: '#ef4444' }}>Principales Dolores:</strong>
                <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                  {personaData.painPoints.map((p, idx) => <li key={idx}>{p}</li>)}
                </ul>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setEditorStep(3)}>
              Generar Esqueleto & Copys de Secciones <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SKELETON & SECTIONS NARRATIVE */}
      {editorStep === 3 && skeletonData && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                Paso 3: Esqueleto & Estructura Narrativa (Sin Estilo Aún)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Definición del orden de secciones y copys estructurados. Todo el esqueleto antes del diseño gráfico.
              </p>
            </div>

            <button className="btn btn-primary btn-sm" onClick={() => setEditorStep(4)}>
              Siguiente: Consultar Enciclopedia UI <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {skeletonData.sections.map((sec, idx) => (
              <div key={idx} style={{ background: '#f8fafc', border: '1px solid var(--border-color)', padding: '14px 18px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-gray">Sección {idx + 1}</span>
                    <strong style={{ fontSize: '14px' }}>{sec.name}</strong>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Propósito: {sec.purpose}
                  </div>
                </div>
                <span className="badge badge-blue">Esqueleto Validado</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: UI ENCYCLOPEDIA DIRECTION CONSULTATION */}
      {editorStep === 4 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Paso 4: Consulta a Enciclopedia UI de Alto Gusto (3 Niveles)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Selecciona el Vibe / Estilo visual que la IA buscará en la Enciclopedia centralizada de referencias.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {[
              { id: 'Coda Monocromático', name: 'Coda Monocromático', desc: 'Bordes inset 1.5px, blanco y negro, alto contraste, tipografía Inter / Calibre-R.' },
              { id: 'Apple Clean', name: 'Apple Clean', desc: 'Espaciado generoso, imágenes hero grandes, micro-badges de durabilidad.' },
              { id: 'Dark Industrial', name: 'Dark Industrial', desc: 'Fondo oscuro #090d16, acentos cian, Bento Grids y tarjetas retroiluminadas.' },
              { id: 'Accent Corporativo', name: 'Accent Corporativo', desc: 'Azul corporativo B2B, alta densidad de datos y tablas de precios claras.' }
            ].map(theme => (
              <div
                key={theme.id}
                onClick={() => setSelectedVibe(theme.id)}
                style={{
                  border: '1.5px inset',
                  borderColor: selectedVibe === theme.id ? '#111827' : 'var(--border-color)',
                  background: selectedVibe === theme.id ? '#f1f5f9' : '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>{theme.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{theme.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={() => { handleSaveWebToDB(); setEditorStep(5); }}>
              Generar Producto Terminado Estilo Google Stitch <Zap size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: GOOGLE STITCH MULTIVARIANT FINISHED PRODUCT & 1-CLICK TABS */}
      {editorStep === 5 && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
                Paso 5: Motor Multivariante Estilo Google Stitch (Producto Terminado)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Cambio instantáneo en 1-clic entre las diferentes propuestas completas generadas.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                <button 
                  className={`btn btn-xs ${renderMode === 'visual' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setRenderMode('visual')}
                >
                  <Eye size={12} /> Render React
                </button>
                <button 
                  className={`btn btn-xs ${renderMode === 'code' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setRenderMode('code')}
                >
                  <Code size={12} /> HTML Standalone
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click Proposal Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedProposal(num)}
                className={`btn btn-sm ${selectedProposal === num ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexShrink: 0 }}
              >
                {num <= 3 ? `Propuesta Gianni #${num}` : `Optimizada por IA #${num}`}
              </button>
            ))}
          </div>

          {/* Visual Render or HTML Source */}
          {renderMode === 'visual' ? (
            <div style={{ border: '1.5px inset var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              {selectedProposal % 2 === 0 ? (
                <VideoHero copy={{ headline: offerData?.tagline, subheadline: offerData?.coreOffer, ctaText: offerData?.callToAction }} />
              ) : (
                <CleanHero copy={{ headline: offerData?.tagline, subheadline: offerData?.coreOffer, ctaText: offerData?.callToAction }} />
              )}
              <FeatureBento />
              <LeadCaptureForm />
              <MinimalFooter />
            </div>
          ) : (
            <textarea
              readOnly
              value={generateFullHTML()}
              style={{ width: '100%', height: '450px', padding: '16px', fontFamily: 'monospace', fontSize: '12px', background: '#0f172a', color: '#f8fafc', borderRadius: '10px', border: 'none' }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleCopyCode}>
              {copiedCode ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
              {copiedCode ? 'Código HTML Copiado' : 'Copiar HTML Standalone'}
            </button>
            <button className="btn btn-primary" onClick={handleDownloadHTML}>
              <Download size={16} /> Descargar Archivo HTML (.html)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
