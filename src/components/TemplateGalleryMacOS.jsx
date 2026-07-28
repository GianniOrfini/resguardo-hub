import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Sliders, 
  Copy, 
  Eye, 
  Check, 
  Star, 
  Bot, 
  X, 
  FileText, 
  Maximize2,
  Trash2,
  Zap
} from 'lucide-react';

export default function TemplateGalleryMacOS({ onUseTemplate, onNotification }) {
  const templates = useLiveQuery(() => db.templates.toArray(), []) || [];

  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [cardZoomSize, setCardZoomSize] = useState(300); // Zoom slider size in px
  const [activeModalTemplate, setActiveModalTemplate] = useState(null);
  const [modalTab, setModalTab] = useState('preview'); // 'preview' | 'code'
  const [copiedId, setCopiedId] = useState(null);

  // New Template Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTmplName, setNewTmplName] = useState('');
  const [newTmplCategory, setNewTmplCategory] = useState('Cold Outreach');
  const [newTmplAudience, setNewTmplAudience] = useState('');
  const [newTmplSubject, setNewTmplSubject] = useState('');
  const [newTmplBody, setNewTmplBody] = useState('');

  const categories = ['Todas', 'Cold Outreach', 'Lead Gen', 'Onboarding', 'Nurturing', 'Promocional'];

  // Filter templates
  const filteredTemplates = templates.filter(tmpl => {
    const matchesCat = selectedCategory === 'Todas' || tmpl.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tmpl.subject && tmpl.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tmpl.targetAudience && tmpl.targetAudience.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopyCode = (tmpl) => {
    navigator.clipboard.writeText(tmpl.htmlBody || '');
    setCopiedId(tmpl.id);
    onNotification(`Código HTML de "${tmpl.name}" copiado al portapapeles.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDuplicateTemplate = async (tmpl) => {
    const newDoc = {
      name: `${tmpl.name} (Variante IA)`,
      category: tmpl.category,
      targetAudience: tmpl.targetAudience,
      description: `Variante generada a partir de ${tmpl.name}`,
      subject: tmpl.subject,
      preheader: tmpl.preheader,
      htmlBody: tmpl.htmlBody,
      rating: 4.8,
      isAiGenerated: true,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    await db.templates.add(newDoc);
    onNotification(`Variante creada exitosamente: "${newDoc.name}"`);
  };

  const handleDeleteTemplate = async (id) => {
    await db.templates.delete(id);
    setActiveModalTemplate(null);
    onNotification('Plantilla eliminada.');
  };

  const handleCreateTemplateSubmit = async (e) => {
    e.preventDefault();
    if (!newTmplName.trim()) return;

    await db.templates.add({
      name: newTmplName,
      category: newTmplCategory,
      targetAudience: newTmplAudience || 'General Resguardo',
      description: 'Plantilla agregada manualmente por el usuario.',
      subject: newTmplSubject,
      preheader: 'Pre-encabezado estándar...',
      htmlBody: newTmplBody || `<div><h2>${newTmplName}</h2><p>Contenido inicial...</p></div>`,
      rating: 5.0,
      isAiGenerated: true,
      createdAt: new Date().toISOString().slice(0, 10)
    });

    setShowCreateModal(false);
    setNewTmplName('');
    setNewTmplSubject('');
    setNewTmplBody('');
    onNotification('Nueva plantilla registrada en la base de datos.');
  };

  return (
    <div className="macos-gallery-container">
      {/* Dynamic MacOS Photo Gallery Toolbar */}
      <div className="macos-toolbar">
        {/* Left: Category Pills */}
        <div className="macos-pill-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Middle: Search Bar */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar plantilla IA..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px 6px 32px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Right: MacOS Zoom Control Slider & Add button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="macos-zoom-control">
            <Sliders size={14} />
            <span>Tamaño:</span>
            <input
              type="range"
              min="220"
              max="420"
              step="10"
              value={cardZoomSize}
              onChange={e => setCardZoomSize(Number(e.target.value))}
              className="macos-zoom-slider"
              title="Ajustar tamaño de miniaturas (MacOS Style)"
            />
          </div>

          <button className="btn btn-primary btn-sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={14} /> Nueva Plantilla
          </button>
        </div>
      </div>

      {/* Grid Status Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div>
          Mostrando <strong>{filteredTemplates.length}</strong> plantillas cargadas de IA
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-purple)', fontWeight: '600' }}>
          <Bot size={15} /> Creadas por la IA del técnico anterior
        </div>
      </div>

      {/* Dynamic Grid of Template Cards (MacOS Photos Gallery) */}
      <div
        className="template-grid"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${cardZoomSize}px, 1fr))`
        }}
      >
        {filteredTemplates.map(tmpl => (
          <div
            key={tmpl.id}
            className="template-card"
            onClick={() => setActiveModalTemplate(tmpl)}
          >
            {/* Visual Mini-Mockup Render Header */}
            <div className="template-preview-frame">
              <div className="template-preview-mockup">
                <div style={{ fontWeight: '800', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px', color: '#0f172a' }}>
                  {tmpl.subject || tmpl.name}
                </div>
                <div 
                  style={{ opacity: 0.8 }}
                  dangerouslySetInnerHTML={{ __html: tmpl.htmlBody ? tmpl.htmlBody.slice(0, 140) + '...' : '' }}
                />
              </div>
            </div>

            {/* Card Info */}
            <div className="template-card-body">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                  <Bot size={11} /> Plantilla IA
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#f59e0b', fontWeight: '700' }}>
                  <Star size={12} fill="#f59e0b" /> {tmpl.rating || 4.9}
                </div>
              </div>

              <div className="template-card-title">{tmpl.name}</div>
              <div className="template-card-desc">{tmpl.description || tmpl.targetAudience}</div>

              <div className="template-card-footer">
                <span style={{ color: 'var(--text-muted)' }}>{tmpl.category}</span>
                <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>Ver Detalle &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal 1: Lightbox Preview & Editor Modal (MacOS Style) */}
      {activeModalTemplate && (
        <div className="modal-overlay" onClick={() => setActiveModalTemplate(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: '#f3e8ff', color: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                    {activeModalTemplate.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Audiencia: {activeModalTemplate.targetAudience} • Categoría: {activeModalTemplate.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTemplate(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Modal Top Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn btn-sm ${modalTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setModalTab('preview')}
                  >
                    <Eye size={14} /> Rendered Email
                  </button>
                  <button
                    className={`btn btn-sm ${modalTab === 'code' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setModalTab('code')}
                  >
                    <FileText size={14} /> Código HTML
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCopyCode(activeModalTemplate)}
                  >
                    {copiedId === activeModalTemplate.id ? <Check size={14} color="var(--accent-green)" /> : <Copy size={14} />}
                    {copiedId === activeModalTemplate.id ? 'Copiado' : 'Copiar HTML'}
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDuplicateTemplate(activeModalTemplate)}
                  >
                    <Zap size={14} style={{ color: 'var(--accent-amber)' }} /> Variar con IA
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      onUseTemplate(activeModalTemplate);
                      setActiveModalTemplate(null);
                    }}
                  >
                    Usar esta Plantilla
                  </button>
                </div>
              </div>

              {/* Subject & Preheader Bar */}
              <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  <strong>Asunto:</strong> {activeModalTemplate.subject}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <strong>Pre-header:</strong> {activeModalTemplate.preheader}
                </div>
              </div>

              {/* Main Content Pane */}
              {modalTab === 'preview' ? (
                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '24px', minHeight: '320px' }}>
                  <div dangerouslySetInnerHTML={{ __html: activeModalTemplate.htmlBody }} />
                </div>
              ) : (
                <textarea
                  readOnly
                  value={activeModalTemplate.htmlBody}
                  style={{
                    width: '100%',
                    height: '320px',
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

            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDeleteTemplate(activeModalTemplate.id)}
                style={{ color: 'var(--accent-red)' }}
              >
                <Trash2 size={14} /> Eliminar Plantilla
              </button>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Resguardo Graphic Designs & Logistics • Template Vault
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create New Template */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                Añadir Nueva Plantilla de Email
              </h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTemplateSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Nombre de la Plantilla</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Secuencia B2B Cartelería 2026"
                    value={newTmplName}
                    onChange={e => setNewTmplName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Categoría</label>
                    <select
                      value={newTmplCategory}
                      onChange={e => setNewTmplCategory(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    >
                      <option>Cold Outreach</option>
                      <option>Lead Gen</option>
                      <option>Onboarding</option>
                      <option>Nurturing</option>
                      <option>Promocional</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Audiencia Objetivo</label>
                    <input
                      type="text"
                      placeholder="Ej: Dueños de negocios MD"
                      value={newTmplAudience}
                      onChange={e => setNewTmplAudience(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Asunto por Defecto</label>
                  <input
                    type="text"
                    placeholder="Línea de asunto..."
                    value={newTmplSubject}
                    onChange={e => setNewTmplSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Código HTML / Texto</label>
                  <textarea
                    rows={6}
                    placeholder="<div style=...>Contenido HTML de la plantilla...</div>"
                    value={newTmplBody}
                    onChange={e => setNewTmplBody(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '12px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Plantilla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
