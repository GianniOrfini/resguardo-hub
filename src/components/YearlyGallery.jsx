import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { 
  Calendar, 
  Eye, 
  EyeOff, 
  Sliders, 
  Sparkles, 
  Copy, 
  Check, 
  Maximize2, 
  X, 
  MoveVertical,
  Zap,
  Bot,
  Grid
} from 'lucide-react';

export default function YearlyGallery({ onNotification }) {
  // Query templates, email history, and scheduled emails
  const templates = useLiveQuery(() => db.templates.toArray(), []) || [];
  const emailHistory = useLiveQuery(() => db.emailHistory.toArray(), []) || [];
  const scheduledEmails = useLiveQuery(() => db.scheduledEmails.toArray(), []) || [];

  // State
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [pureMode, setPureMode] = useState(true); // Default to PURE VISUAL STREAM (No titles/metadata, just raw emails!)
  const [cardWidth, setCardWidth] = useState(380); // Slider for width in px
  const [cardHeight, setCardHeight] = useState(600); // Slider for vertical content height in px
  const [activeModalEmail, setActiveModalEmail] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Available Years
  const availableYears = ['2026', '2025', '2024'];

  const monthsList = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Helper to extract year and month name from a date string (YYYY-MM-DD)
  const parseDateInfo = (dateStr) => {
    if (!dateStr) return { year: '2026', monthIndex: 7, monthName: 'Agosto' };
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return { year: '2026', monthIndex: 7, monthName: 'Agosto' };

    const year = String(dateObj.getFullYear());
    const monthIndex = dateObj.getMonth(); // 0 - 11
    const monthName = monthsList[monthIndex + 1] || 'Agosto';

    return { year, monthIndex, monthName };
  };

  // Consolidate all items (history + templates + scheduled) for the yearly timeline
  const allYearlyItems = [
    ...emailHistory.map(item => ({
      ...item,
      sourceType: 'Historial',
      dateKey: item.sentDate || item.addedAt || '2026-08-02',
      displayTitle: item.subject || 'Email sin asunto',
      htmlContent: item.htmlBody || `<div style="font-family:-apple-system,sans-serif;padding:24px;color:#111827;white-space:pre-wrap;line-height:1.6;">${item.bodyText || ''}</div>`
    })),

    ...scheduledEmails.map(item => ({
      ...item,
      sourceType: 'Programado',
      dateKey: item.scheduledDate || '2026-08-04',
      displayTitle: item.subject || 'Email Programado',
      htmlContent: item.content || `<div style="font-family:-apple-system,sans-serif;padding:24px;color:#111827;white-space:pre-wrap;line-height:1.6;">${item.subject || ''}</div>`
    })),

    ...templates.map(tmpl => ({
      ...tmpl,
      sourceType: 'Plantilla IA',
      dateKey: tmpl.createdAt ? `2026-${tmpl.createdAt.slice(5, 10)}` : '2026-08-01',
      displayTitle: tmpl.name,
      htmlContent: tmpl.htmlBody || `<div style="font-family:-apple-system,sans-serif;padding:24px;color:#111827;">${tmpl.description || ''}</div>`
    }))
  ];

  // Filter items by Selected Year and Selected Month
  const filteredItems = allYearlyItems.filter(item => {
    const { year, monthName } = parseDateInfo(item.dateKey);
    const matchesYear = year === selectedYear;
    const matchesMonth = selectedMonth === 'Todos' || monthName === selectedMonth;
    return matchesYear && matchesMonth;
  });

  // Group filtered items by Month
  const groupedByMonth = filteredItems.reduce((acc, item) => {
    const { monthName } = parseDateInfo(item.dateKey);
    acc[monthName] = acc[monthName] || [];
    acc[monthName].push(item);
    return acc;
  }, {});

  const handleCopyEmail = (item) => {
    const rawText = item.bodyText || item.htmlContent || '';
    navigator.clipboard.writeText(`ASUNTO: ${item.displayTitle}\n\n${rawText}`);
    setCopiedId(item.id || item.displayTitle);
    onNotification(`Contenido de "${item.displayTitle}" copiado al portapapeles.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAutoLoadAgentEmails = async () => {
    onNotification('Sincronizando todas las plantillas y correos en la galería anual...');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Yearly Gallery Toolbar */}
      <div className="macos-toolbar" style={{ flexWrap: 'wrap', gap: '14px' }}>
        {/* Year Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} style={{ color: 'var(--accent-purple)' }} />
          <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>Año:</strong>
          {availableYears.map(yr => (
            <button
              key={yr}
              className={`pill-btn ${selectedYear === yr ? 'active' : ''}`}
              onClick={() => setSelectedYear(yr)}
              style={{ padding: '5px 14px', fontSize: '12.5px' }}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Month Pills */}
        <div className="macos-pill-filters" style={{ flex: 1, overflowX: 'auto' }}>
          {monthsList.map(m => (
            <button
              key={m}
              className={`pill-btn ${selectedMonth === m ? 'active' : ''}`}
              onClick={() => setSelectedMonth(m)}
              style={{ fontSize: '12px', padding: '4px 12px' }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* View Mode & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Pure Mode Toggle */}
          <button
            className={`btn btn-sm ${pureMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPureMode(!pureMode)}
            title={pureMode ? "Modo Puro Activo (Solo diseños completos de mails sin texto ruidoso)" : "Ver metadatos y títulos"}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {pureMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{pureMode ? 'Modo Puro (Solo Mails)' : 'Modo Estándar'}</span>
          </button>

          {/* Width Zoom Slider */}
          <div className="macos-zoom-control">
            <Sliders size={14} />
            <span>Ancho:</span>
            <input
              type="range"
              min="280"
              max="580"
              step="20"
              value={cardWidth}
              onChange={e => setCardWidth(Number(e.target.value))}
              className="macos-zoom-slider"
              title="Ajustar ancho de tarjetas"
            />
          </div>

          {/* Height Slider */}
          <div className="macos-zoom-control">
            <MoveVertical size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>Alto:</span>
            <input
              type="range"
              min="350"
              max="900"
              step="30"
              value={cardHeight}
              onChange={e => setCardHeight(Number(e.target.value))}
              className="macos-zoom-slider"
              title="Ajustar altura de supervisión vertical"
            />
          </div>

          {/* Sync Button */}
          <button className="btn btn-secondary btn-sm" onClick={handleAutoLoadAgentEmails} title="Sincronizar emails generados por agentes de IA">
            <Bot size={14} style={{ color: 'var(--accent-purple)' }} /> Sincronizar IA
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div>
          Galería Anual de Supervisión <strong>{selectedYear}</strong> • <strong>{filteredItems.length}</strong> correos desplegados completos
        </div>
        {pureMode && (
          <div style={{ background: '#f3e8ff', color: '#7c3aed', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} /> Visualización Pura Activada (Sin cabeceras ruidosas)
          </div>
        )}
      </div>

      {/* Render Emails grouped by Month */}
      {Object.keys(groupedByMonth).length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Grid size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <h3>No hay correos registrados para {selectedMonth} de {selectedYear}</h3>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>Selecciona otro mes o usa el botón "Sincronizar IA" para cargar correos automáticamente.</p>
        </div>
      ) : (
        Object.entries(groupedByMonth).map(([monthName, items]) => (
          <div key={monthName} style={{ marginBottom: '16px' }}>
            {/* Month Header Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {monthName} {selectedYear}
              </h3>
              <span className="badge badge-gray">{items.length} correos</span>
            </div>

            {/* Email Cards Grid for this Month */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
                gap: '24px'
              }}
            >
              {items.map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative'
                  }}
                  className="template-card"
                  onClick={() => setActiveModalEmail(item)}
                >
                  {/* Optional Standard Bar (Hidden if pureMode is true!) */}
                  {!pureMode && (
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.displayTitle}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {item.dateKey} • {item.category || item.sourceType}
                        </div>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => { e.stopPropagation(); handleCopyEmail(item); }}
                        title="Copiar contenido"
                      >
                        {copiedId === (item.id || item.displayTitle) ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                      </button>
                    </div>
                  )}

                  {/* FULL VERTICAL EMAIL PREVIEW FRAME */}
                  <div
                    style={{
                      height: `${cardHeight}px`,
                      width: '100%',
                      background: '#ffffff',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:20px;background:#ffffff;color:#111827;box-sizing:border-box;} img{max-width:100%;} p{line-height:1.6;}</style></head><body>${item.htmlContent}</body></html>`}
                      title={item.displayTitle}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#ffffff',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Quick Hover Inspect Action Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(17, 24, 39, 0.85)',
                      color: '#ffffff',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      <Maximize2 size={12} /> Supervisar &rarr;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Lightbox Inspector Modal for Full Screen Inspection */}
      {activeModalEmail && (
        <div className="modal-overlay" onClick={() => setActiveModalEmail(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                  {activeModalEmail.displayTitle}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Fecha: {activeModalEmail.dateKey} • Fuente: {activeModalEmail.sourceType}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleCopyEmail(activeModalEmail)}>
                  <Copy size={14} /> Copiar Email
                </button>
                <button onClick={() => setActiveModalEmail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ minHeight: '450px', padding: '0', overflow: 'hidden' }}>
              <iframe
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:28px;background:#ffffff;color:#111827;box-sizing:border-box;} img{max-width:100%;} p{line-height:1.6;}</style></head><body>${activeModalEmail.htmlContent}</body></html>`}
                title={activeModalEmail.displayTitle}
                style={{ width: '100%', height: '500px', border: 'none', background: '#ffffff' }}
              />
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Resguardo Hub • Galería de Supervisión Anual
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModalEmail(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
