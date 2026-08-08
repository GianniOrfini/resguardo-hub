import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { analyzeDeliverability, transformToB2BVariants } from '../utils/deliverabilityChecker';
import DNSStatusModal from './DNSStatusModal';
import { Save, Eye, Code, Sparkles, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Wand2, HelpCircle } from 'lucide-react';

export default function EmailContentEditor({ selectedEmail, onNotification }) {
  const scheduledEmails = useLiveQuery(() => db.scheduledEmails.toArray(), []) || [];
  const templates = useLiveQuery(() => db.templates.toArray(), []) || [];

  const [activeEmailId, setActiveEmailId] = useState(null);
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState('');
  const [category, setCategory] = useState('Cold Outreach');
  const [segment, setSegment] = useState('Leads B2B');
  const [status, setStatus] = useState('Borrador');
  const [scheduledDate, setScheduledDate] = useState('');
  const [htmlBody, setHtmlBody] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'code'

  // Modals & B2B assistant state
  const [showDNSModal, setShowDNSModal] = useState(false);
  const [showB2BModal, setShowB2BModal] = useState(false);
  const [b2bVariants, setB2bVariants] = useState(null);

  useEffect(() => {
    if (selectedEmail) {
      setActiveEmailId(selectedEmail.id);
      setSubject(selectedEmail.subject || '');
      setPreheader(selectedEmail.preheader || '');
      setCategory(selectedEmail.category || 'Cold Outreach');
      setSegment(selectedEmail.segment || 'Base General');
      setStatus(selectedEmail.status || 'Borrador');
      setScheduledDate(selectedEmail.scheduledDate || '');
      setHtmlBody(selectedEmail.content || selectedEmail.htmlBody || '');
    } else if (scheduledEmails.length > 0 && !activeEmailId) {
      const first = scheduledEmails[0];
      setActiveEmailId(first.id);
      setSubject(first.subject || '');
      setPreheader(first.preheader || '');
      setCategory(first.category || 'Cold Outreach');
      setSegment(first.segment || 'Base General');
      setStatus(first.status || 'Borrador');
      setScheduledDate(first.scheduledDate || '');
      setHtmlBody(first.content || first.htmlBody || '');
    }
  }, [selectedEmail, scheduledEmails]);

  const handleSelectEmail = (email) => {
    setActiveEmailId(email.id);
    setSubject(email.subject || '');
    setPreheader(email.preheader || '');
    setCategory(email.category || 'Cold Outreach');
    setSegment(email.segment || 'Base General');
    setStatus(email.status || 'Borrador');
    setScheduledDate(email.scheduledDate || '');
    setHtmlBody(email.content || email.htmlBody || '');
  };

  const handleApplyTemplate = (template) => {
    setSubject(template.subject || subject);
    setPreheader(template.preheader || preheader);
    setHtmlBody(template.htmlBody || htmlBody);
    onNotification(`Plantilla "${template.name}" cargada en el editor.`);
  };

  const handleSaveEmail = async () => {
    if (!subject.trim()) return;

    if (activeEmailId) {
      await db.scheduledEmails.update(activeEmailId, {
        subject,
        preheader,
        category,
        segment,
        status,
        scheduledDate,
        content: htmlBody
      });
      onNotification('Email actualizado guardado localmente.');
    } else {
      const newId = await db.scheduledEmails.add({
        subject,
        preheader,
        category,
        segment,
        status,
        scheduledDate: scheduledDate || new Date().toISOString().slice(0, 16),
        content: htmlBody
      });
      setActiveEmailId(newId);
      onNotification('Nuevo email guardado.');
    }
  };

  // Real-time deliverability evaluation
  const audit = analyzeDeliverability({ subject, preheader, content: htmlBody });

  const handleGenerateB2BVariants = () => {
    const variants = transformToB2BVariants({ subject, content: htmlBody });
    setB2bVariants(variants);
    setShowB2BModal(true);
  };

  const handleApplyVariant = (variant) => {
    setSubject(variant.subject);
    setPreheader(variant.preheader);
    setHtmlBody(variant.content);
    setShowB2BModal(false);
    onNotification(`Variante "${variant.name}" aplicada al editor.`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
      {/* Left List of Scheduled/Draft Emails */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '16px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700' }}>
            Lista de Correos
          </h3>
          <button 
            className="btn btn-xs btn-secondary"
            onClick={() => {
              setActiveEmailId(null);
              setSubject('Nueva Campaña B2B Resguardo');
              setPreheader('Presencia visual de alto nivel para tu comercio');
              setCategory('Cold Outreach');
              setHtmlBody('<p>Hola, te escribimos de Resguardo Designs...</p>');
            }}
          >
            + Nuevo
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {scheduledEmails.map(e => (
            <div
              key={e.id}
              onClick={() => handleSelectEmail(e)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeEmailId === e.id ? 'var(--text-primary)' : 'var(--border-color)',
                backgroundColor: activeEmailId === e.id ? '#f1f5f9' : '#ffffff',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {e.subject || 'Sin asunto'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>{e.category}</span>
                <span className={`badge ${e.status === 'Programado' ? 'badge-blue' : 'badge-amber'}`}>
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor Pane */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Anti-Spam Gauge & DNS Header Bar */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: audit.riskColor }}>
                {100 - audit.spamScore}%
              </div>
              <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Entregabilidad
              </div>
            </div>

            <div style={{ height: '32px', width: '1px', background: 'var(--border-color)' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Riesgo de Spam:</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: audit.riskColor }}>{audit.riskLevel}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {audit.detectedTriggers.length > 0 
                  ? `Palabras riesgocas: ${audit.detectedTriggers.map(t => `"${t.word}"`).join(', ')}`
                  : audit.suggestions[0]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleGenerateB2BVariants}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Wand2 size={14} color="#8b5cf6" /> Convertir a Tono B2B (3 Variantes)
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowDNSModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ShieldCheck size={14} color="#16a34a" /> Estado DNS Domain
            </button>
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${viewMode === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={14} /> Vista Previa HTML
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'code' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('code')}
            >
              <Code size={14} /> Editor de Código HTML
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}
              onChange={(e) => {
                const t = templates.find(temp => temp.id === Number(e.target.value));
                if (t) handleApplyTemplate(t);
              }}
              defaultValue=""
            >
              <option value="" disabled>Cargar desde Plantilla IA...</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <button className="btn btn-primary btn-sm" onClick={handleSaveEmail}>
              <Save size={14} /> Guardar Cambios
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Línea de Asunto</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Asunto del correo..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Pre-encabezado (Preheader)</label>
            <input
              type="text"
              value={preheader}
              onChange={e => setPreheader(e.target.value)}
              placeholder="Texto de vista previa en bandeja..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Categoría</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
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
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Segmento (GHL)</label>
            <input
              type="text"
              value={segment}
              onChange={e => setSegment(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Estado</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
            >
              <option>Borrador</option>
              <option>Programado</option>
              <option>Enviado</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Fecha Programada</label>
            <input
              type="datetime-local"
              value={scheduledDate ? scheduledDate.slice(0, 16) : ''}
              onChange={e => setScheduledDate(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
            />
          </div>
        </div>

        {/* HTML / Body Content Editor & Sandboxed Renderer */}
        <div style={{ flex: 1, minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Contenido HTML / Mensaje
          </label>

          {viewMode === 'code' ? (
            <textarea
              value={htmlBody}
              onChange={e => setHtmlBody(e.target.value)}
              placeholder="Escribe o pega el código HTML del email..."
              style={{
                width: '100%',
                flex: 1,
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontFamily: 'monospace',
                fontSize: '12.5px',
                lineHeight: '1.5',
                background: '#1e293b',
                color: '#f8fafc'
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                flex: 1,
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                overflow: 'hidden'
              }}
            >
              <iframe
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:20px;background:#ffffff;color:#111827;} img{max-width:100%;}</style></head><body>${htmlBody || '<p style="color: #94a3b8; font-style: italic;">Sin contenido cargado. Selecciona una plantilla o escribe HTML en el editor.</p>'}</body></html>`}
                title="Preview Email Content"
                style={{ width: '100%', height: '100%', border: 'none', background: '#ffffff' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* DNS Audit Modal */}
      {showDNSModal && (
        <DNSStatusModal 
          onClose={() => setShowDNSModal(false)}
          onNotification={onNotification}
        />
      )}

      {/* B2B Copy Generator Modal */}
      {showB2BModal && b2bVariants && (
        <div className="modal-overlay" onClick={() => setShowB2BModal(false)}>
          <div className="modal-content" style={{ maxWidth: '850px', width: '90%' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700' }}>
                Asistente de Tono B2B (3 Variantes Anti-Técnicas)
              </h3>
              <button onClick={() => setShowB2BModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Se transformaron los detalles técnicos en copys enfocados en crecimiento comercial, ROI y captación de clientes locales en Maryland.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', maxHeight: '60vh', overflowY: 'auto' }}>
              {Object.values(b2bVariants).map((variant, i) => (
                <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', background: '#f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>{variant.name}</h4>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                      Asunto: <span style={{ color: 'var(--text-muted)' }}>{variant.subject}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      Preheader: {variant.preheader}
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleApplyVariant(variant)}
                  >
                    Usar Esta Variante
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
