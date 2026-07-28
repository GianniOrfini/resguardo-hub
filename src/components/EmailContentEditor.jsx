import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { Save, Eye, Code, Send, Check, Sparkles, AlertCircle } from 'lucide-react';

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
      {/* Left List of Scheduled/Draft Emails */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '16px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
          Lista de Correos
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {scheduledEmails.map(e => (
            <div
              key={e.id}
              onClick={() => handleSelectEmail(e)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: activeEmailId === e.id ? 'var(--accent-primary)' : 'var(--border-color)',
                backgroundColor: activeEmailId === e.id ? '#f1f5f9' : '#ffffff',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {e.subject}
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
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

        {/* HTML / Body Content Editor & Renderer */}
        <div style={{ flex: 1, minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
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
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                overflowY: 'auto'
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: htmlBody || '<p style="color: #94a3b8; font-style: italic;">Sin contenido cargado. Selecciona una plantilla o escribe HTML en el editor.</p>' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
