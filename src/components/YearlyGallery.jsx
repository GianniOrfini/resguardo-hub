import React, { useState, useEffect } from 'react';
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
  X, 
  MoveVertical,
  Bot,
  Grid,
  Code,
  UnfoldVertical
} from 'lucide-react';

export default function YearlyGallery({ onNotification }) {
  // Query templates, email history, and scheduled emails
  const templates = useLiveQuery(() => db.templates.toArray(), []) || [];
  const emailHistory = useLiveQuery(() => db.emailHistory.toArray(), []) || [];
  const scheduledEmails = useLiveQuery(() => db.scheduledEmails.toArray(), []) || [];

  // State
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [pureMode, setPureMode] = useState(true); // Pure visual stream mode
  const [autoFullHeight, setAutoFullHeight] = useState(true); // DEFAULT TO 100% FULL EMAIL HEIGHT!
  const [cardWidth, setCardWidth] = useState(380); // Slider for width in px (range 120px - 1200px)
  const [cardHeight, setCardHeight] = useState(750); // Slider for height in px (range 100px - 3500px)
  const [activeModalEmail, setActiveModalEmail] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [iframeHeights, setIframeHeights] = useState({});

  // Listen for iframe height messages to expand frames to 100% real content height
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.frameId && event.data.height) {
        setIframeHeights(prev => ({
          ...prev,
          [event.data.frameId]: Math.max(event.data.height + 20, 250)
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Available Years
  const availableYears = ['2026', '2025', '2024'];

  const monthsList = [
    'Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const parseDateInfo = (dateStr) => {
    if (!dateStr) return { year: '2026', monthIndex: 7, monthName: 'Agosto' };
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return { year: '2026', monthIndex: 7, monthName: 'Agosto' };

    const year = String(dateObj.getFullYear());
    const monthIndex = dateObj.getMonth();
    const monthName = monthsList[monthIndex + 1] || 'Agosto';

    return { year, monthIndex, monthName };
  };

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

  const filteredItems = allYearlyItems.filter(item => {
    const { year, monthName } = parseDateInfo(item.dateKey);
    const matchesYear = year === selectedYear;
    const matchesMonth = selectedMonth === 'Todos' || monthName === selectedMonth;
    return matchesYear && matchesMonth;
  });

  const groupedByMonth = filteredItems.reduce((acc, item) => {
    const { monthName } = parseDateInfo(item.dateKey);
    acc[monthName] = acc[monthName] || [];
    acc[monthName].push(item);
    return acc;
  }, {});

  const handleCopyEmail = (item) => {
    const rawText = item.bodyText || item.htmlContent || '';
    navigator.clipboard.writeText(`ASUNTO: ${item.displayTitle}\n\n${rawText}`);
    setCopiedId(`text-${item.id || item.displayTitle}`);
    onNotification(`Texto de "${item.displayTitle}" copiado al portapapeles.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyHtml = (item) => {
    const htmlToCopy = item.htmlContent || item.htmlBody || '';
    navigator.clipboard.writeText(htmlToCopy);
    setCopiedId(`html-${item.id || item.displayTitle}`);
    onNotification(`Código HTML de "${item.displayTitle}" copiado al portapapeles.`);
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

        {/* View Mode & Extended Sliders Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* 100% Full Height Mode Toggle */}
          <button
            className={`btn btn-sm ${autoFullHeight ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setAutoFullHeight(!autoFullHeight)}
            title="Mostrar el 100% de la altura de cada mail de arriba a abajo sin recortes ni scroll interno"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <UnfoldVertical size={14} />
            <span>{autoFullHeight ? 'Alto 100% Completo (ON)' : 'Alto Fijo'}</span>
          </button>

          {/* Pure Mode Toggle */}
          <button
            className={`btn btn-sm ${pureMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setPureMode(!pureMode)}
            title="Solo correos limpios sin texto ruidoso"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {pureMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{pureMode ? 'Modo Puro (Solo Mails)' : 'Modo Estándar'}</span>
          </button>

          {/* Extended Width Zoom Slider (120px to 1200px) */}
          <div className="macos-zoom-control">
            <Sliders size={14} />
            <span>Ancho ({cardWidth}px):</span>
            <input
              type="range"
              min="120"
              max="1200"
              step="10"
              value={cardWidth}
              onChange={e => setCardWidth(Number(e.target.value))}
              className="macos-zoom-slider"
              style={{ width: '130px' }}
              title="Ajustar ancho libre de tarjetas (120px a 1200px)"
            />
          </div>

          {/* Extended Height Slider (100px to 3500px) */}
          {!autoFullHeight && (
            <div className="macos-zoom-control">
              <MoveVertical size={14} style={{ color: 'var(--accent-blue)' }} />
              <span>Alto ({cardHeight}px):</span>
              <input
                type="range"
                min="100"
                max="3500"
                step="50"
                value={cardHeight}
                onChange={e => setCardHeight(Number(e.target.value))}
                className="macos-zoom-slider"
                style={{ width: '130px' }}
                title="Ajustar alto libre de tarjetas (100px a 3500px)"
              />
            </div>
          )}

          {/* Sync Button */}
          <button className="btn btn-secondary btn-sm" onClick={handleAutoLoadAgentEmails} title="Sincronizar emails generados por agentes de IA">
            <Bot size={14} style={{ color: 'var(--accent-purple)' }} /> Sincronizar IA
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <div>
          Galería Anual <strong>{selectedYear}</strong> • <strong>{filteredItems.length}</strong> correos desplegados en vista 100% completa
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {autoFullHeight && (
            <div style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <UnfoldVertical size={13} /> Visualización 100% Completa
            </div>
          )}
          {pureMode && (
            <div style={{ background: '#f3e8ff', color: '#7c3aed', padding: '3px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} /> Modo Puro Activo
            </div>
          )}
        </div>
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
          <div key={monthName} style={{ marginBottom: '24px' }}>
            {/* Month Header Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {monthName} {selectedYear}
              </h3>
              <span className="badge badge-gray">{items.length} correos</span>
            </div>

            {/* Email Cards Grid for this Month */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
                gap: '24px',
                alignItems: 'start'
              }}
            >
              {items.map((item, index) => {
                const frameKey = `frame-${item.id || index}`;
                const realHeight = iframeHeights[frameKey] || cardHeight;
                const effectiveHeight = autoFullHeight ? `${realHeight}px` : `${cardHeight}px`;

                const iframeSrcDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:20px;background:#ffffff;color:#111827;box-sizing:border-box;} img{max-width:100%;height:auto;} p{line-height:1.6;margin-bottom:1em;}</style></head><body>${item.htmlContent}<script>function reportHeight(){var h=document.documentElement.scrollHeight||document.body.scrollHeight;window.parent.postMessage({frameId:'${frameKey}',height:h},'*');};window.addEventListener('load',reportHeight);setTimeout(reportHeight,300);setTimeout(reportHeight,1000);</script></body></html>`;

                return (
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
                    {/* Floating Quick Action: COPY HTML BUTTON */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: pureMode ? '10px' : '44px',
                        right: '10px',
                        zIndex: 10,
                        display: 'flex',
                        gap: '6px'
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleCopyHtml(item)}
                        style={{
                          fontSize: '11px',
                          padding: '5px 12px',
                          borderRadius: '20px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                        title="Copiar código HTML completo al portapapeles"
                      >
                        {copiedId === `html-${item.id || item.displayTitle}` ? <Check size={12} color="#10b981" /> : <Code size={12} />}
                        <span>{copiedId === `html-${item.id || item.displayTitle}` ? '¡HTML Copiado!' : 'Copiar HTML'}</span>
                      </button>
                    </div>

                    {/* Optional Standard Header Bar (Hidden in pureMode) */}
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
                      </div>
                    )}

                    {/* FULL UNCLIPPED 100% HEIGHT EMAIL CONTAINER */}
                    <div
                      style={{
                        height: effectiveHeight,
                        width: '100%',
                        background: '#ffffff',
                        position: 'relative',
                        overflow: autoFullHeight ? 'visible' : 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <iframe
                        srcDoc={iframeSrcDoc}
                        title={item.displayTitle}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          background: '#ffffff',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Lightbox Inspector Modal for Full Screen Inspection */}
      {activeModalEmail && (
        <div className="modal-overlay" onClick={() => setActiveModalEmail(null)}>
          <div className="modal-content" style={{ maxWidth: '850px', maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
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
                <button className="btn btn-primary btn-sm" onClick={() => handleCopyHtml(activeModalEmail)}>
                  {copiedId === `html-${activeModalEmail.id || activeModalEmail.displayTitle}` ? <Check size={14} color="#10b981" /> : <Code size={14} />}
                  {copiedId === `html-${activeModalEmail.id || activeModalEmail.displayTitle}` ? '¡HTML Copiado!' : 'Copiar Código HTML'}
                </button>

                <button className="btn btn-secondary btn-sm" onClick={() => handleCopyEmail(activeModalEmail)}>
                  <Copy size={14} /> Copiar Texto
                </button>

                <button onClick={() => setActiveModalEmail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ minHeight: '500px', padding: '0', overflow: 'hidden' }}>
              <iframe
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:28px;background:#ffffff;color:#111827;box-sizing:border-box;} img{max-width:100%;} p{line-height:1.6;}</style></head><body>${activeModalEmail.htmlContent}</body></html>`}
                title={activeModalEmail.displayTitle}
                style={{ width: '100%', height: '550px', border: 'none', background: '#ffffff' }}
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
