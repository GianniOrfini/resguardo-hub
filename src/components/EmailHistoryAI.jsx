import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { 
  History, 
  Sparkles, 
  Download, 
  Plus, 
  Bot, 
  Check, 
  Copy, 
  Eye, 
  X, 
  Calendar, 
  Tag, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function EmailHistoryAI({ onNotification }) {
  const historyItems = useLiveQuery(() => db.emailHistory.toArray(), []) || [];

  const [copiedDataset, setCopiedDataset] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeModalEmail, setActiveModalEmail] = useState(null);
  const [copiedRowId, setCopiedRowId] = useState(null);

  // New History Item State
  const [newSubject, setNewSubject] = useState('');
  const [newSentDate, setNewSentDate] = useState(new Date().toISOString().slice(0, 10));
  const [newOpenRate, setNewOpenRate] = useState('');
  const [newClickRate, setNewClickRate] = useState('');
  const [newCategory, setNewCategory] = useState('Cold Outreach');
  const [newSegment, setNewSegment] = useState('Prospectos MD');
  const [newBodyText, setNewBodyText] = useState('');
  const [newAiNotes, setNewAiNotes] = useState('');

  // Quick Copy function for a single email
  const handleQuickCopy = (item) => {
    const textToCopy = `ASUNTO: ${item.subject}\n\nCUERPO:\n${item.bodyText || item.htmlBody || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedRowId(item.id);
    onNotification(`Asunto y contenido de "${item.subject}" copiados al portapapeles.`);
    setTimeout(() => setCopiedRowId(null), 2000);
  };

  // Generate formatted AI Fine-Tuning / Few-Shot Dataset
  const generateAIDatasetJSON = () => {
    return historyItems.map(item => ({
      instruction: `Redacta un correo electrónico de alta conversión para Resguardo Graphic Designs en la categoría "${item.category}" dirigido a "${item.segment}".`,
      subject: item.subject,
      body: item.bodyText || item.htmlBody,
      added_at: item.addedAt || '2026-08-02',
      sent_date: item.sentDate,
      performance: {
        open_rate: item.openRate || 'Sin métricas',
        click_rate: item.clickRate || 'Sin métricas'
      },
      learnings: item.aiNotes || 'Patrón de contenido registrado.'
    }));
  };

  const handleExportDatasetJSON = () => {
    const dataset = generateAIDatasetJSON();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resguardo_ai_training_dataset_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    onNotification('Dataset de entrenamiento para IA exportado en JSON.');
  };

  const handleCopyPromptDataset = () => {
    const dataset = generateAIDatasetJSON();
    const formattedPrompt = `SYSTEM PROMPT: Eres el asistente experto de Email Marketing de Resguardo Graphic Designs. A continuación se presentan los correos pasados registrados para que aprendas el estilo, tono y estructura de la empresa:\n\n` + 
      dataset.map((d, i) => `--- EJEMPLO ${i+1} (${d.subject}) ---\nASUNTO: ${d.subject}\nCUERPO:\n${d.body}\nAPRENDIZAJE CLAVE: ${d.learnings}\n`).join('\n');

    navigator.clipboard.writeText(formattedPrompt);
    setCopiedDataset(true);
    onNotification('Prompt de entrenamiento para IA copiado al portapapeles.');
    setTimeout(() => setCopiedDataset(false), 2500);
  };

  const handleAddHistorySubmit = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    await db.emailHistory.add({
      subject: newSubject,
      sentDate: newSentDate,
      addedAt: new Date().toISOString().slice(0, 10),
      openRate: newOpenRate.trim() || null,
      clickRate: newClickRate.trim() || null,
      category: newCategory,
      segment: newSegment,
      bodyText: newBodyText,
      aiNotes: newAiNotes || 'Registrado manualmente para dataset futuro.'
    });

    setShowAddModal(false);
    setNewSubject('');
    setNewBodyText('');
    setNewOpenRate('');
    setNewClickRate('');
    onNotification('Nuevo email registrado en el historial.');
  };

  const hasValidMetrics = (val) => {
    if (!val) return false;
    const str = String(val).trim();
    return str !== '' && str !== 'null' && str !== 'undefined' && str !== 'Borrador' && str !== 'N/A' && str !== 'Sin métricas';
  };

  return (
    <div>
      {/* Top Banner with AI Training Callout */}
      <div style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', borderRadius: '16px', padding: '24px', color: '#ffffff', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-elevated)' }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={16} /> Dataset para Entrenamiento de IA
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '800', marginTop: '4px' }}>
            Historial de Correos Pasados & Aprendizaje
          </h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px', lineHeight: '1.5' }}>
            Todos los correos registrados se almacenan localmente. Puedes inspeccionar su contenido completo, copiarlos en 1 clic o exportarlos para entrenar modelos de IA.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={handleExportDatasetJSON} style={{ background: '#ffffff', color: '#111827' }}>
            <Download size={15} /> Exportar Dataset (JSON)
          </button>
          <button className="btn btn-secondary" onClick={handleCopyPromptDataset} style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
            {copiedDataset ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
            {copiedDataset ? 'Prompt Copiado' : 'Copiar Prompt para IA'}
          </button>
        </div>
      </div>

      {/* Toolbar & Add Past Email button */}
      <div className="macos-toolbar" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={18} style={{ color: 'var(--accent-purple)' }} />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700' }}>
            Registro de Envíos Realizados ({historyItems.length})
          </h3>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> Registrar Email Enviado
        </button>
      </div>

      {/* History Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px 16px' }}>Asunto del Correo</th>
              <th style={{ padding: '12px' }}>Añadido a Lista</th>
              <th style={{ padding: '12px' }}>Fecha Asignada</th>
              <th style={{ padding: '12px' }}>Categoría / Segmento</th>
              <th style={{ padding: '12px' }}>Apertura (Open)</th>
              <th style={{ padding: '12px' }}>Clicks (CTR)</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map(item => (
              <tr 
                key={item.id} 
                onClick={() => setActiveModalEmail(item)}
                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                className="table-row-hover"
              >
                <td style={{ padding: '14px 16px', fontWeight: '700', maxWidth: '280px' }}>
                  <div style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.subject}
                  </div>
                  {item.preheader && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.preheader}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {item.addedAt || '2026-08-02'}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {item.sentDate || '-'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="badge badge-gray">{item.category}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.segment}</div>
                </td>

                {/* NO FAKE METRICS: Only show badge if valid metrics exist */}
                <td style={{ padding: '12px' }}>
                  {hasValidMetrics(item.openRate) ? (
                    <span className="badge badge-green">{item.openRate}</span>
                  ) : (
                    <span className="badge badge-gray" style={{ color: 'var(--text-muted)' }}>Sin métricas</span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  {hasValidMetrics(item.clickRate) ? (
                    <span className="badge badge-blue">{item.clickRate}</span>
                  ) : (
                    <span className="badge badge-gray" style={{ color: 'var(--text-muted)' }}>Sin métricas</span>
                  )}
                </td>

                {/* Quick Copy & Inspector buttons */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleQuickCopy(item)}
                      title="Copiar asunto y cuerpo al portapapeles"
                    >
                      {copiedRowId === item.id ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                      {copiedRowId === item.id ? 'Copiado' : 'Copiar'}
                    </button>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveModalEmail(item)}
                      title="Ver contenido completo del correo"
                    >
                      <Eye size={13} /> Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Full Email Inspector & Reader */}
      {activeModalEmail && (
        <div className="modal-overlay" onClick={() => setActiveModalEmail(null)}>
          <div className="modal-content" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '34px', height: '34px', background: '#f3e8ff', color: '#8b5cf6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                    {activeModalEmail.subject}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Categoría: {activeModalEmail.category} • Segmento: {activeModalEmail.segment}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalEmail(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Metadata Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '12px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Añadido a la lista:</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{activeModalEmail.addedAt || '2026-08-02'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Fecha Asignada de Envío:</span>
                  <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{activeModalEmail.sentDate || '-'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Métricas Registradas:</span>
                  {hasValidMetrics(activeModalEmail.openRate) ? (
                    <span className="badge badge-green">Open: {activeModalEmail.openRate} | CTR: {activeModalEmail.clickRate}</span>
                  ) : (
                    <span className="badge badge-gray" style={{ color: 'var(--text-muted)' }}>Sin métricas</span>
                  )}
                </div>
              </div>

              {/* Preheader */}
              {activeModalEmail.preheader && (
                <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px' }}>
                  <strong>Pre-encabezado:</strong> {activeModalEmail.preheader}
                </div>
              )}

              {/* AI Learnings / Notes */}
              {activeModalEmail.aiNotes && (
                <div style={{ background: '#f3e8ff', borderLeft: '4px solid #8b5cf6', padding: '12px 16px', borderRadius: '0 8px 8px 0', fontSize: '12.5px', color: '#6b21a8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', marginBottom: '2px' }}>
                    <Bot size={14} /> Aprendizaje / Estrategia IA:
                  </div>
                  <div>{activeModalEmail.aiNotes}</div>
                </div>
              )}

              {/* Full Email Text / Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Contenido Completo del Correo</label>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleQuickCopy(activeModalEmail)}>
                    <Copy size={13} /> Copiar Todo
                  </button>
                </div>

                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '20px',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    color: '#1f2937',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '380px',
                    overflowY: 'auto'
                  }}
                >
                  {activeModalEmail.bodyText || activeModalEmail.htmlBody || 'Sin contenido registrado.'}
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: '#f8fafc' }}>
              <button className="btn btn-secondary" onClick={() => setActiveModalEmail(null)}>Cerrar Inspector</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Past Email Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                Registrar Email en el Historial
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddHistorySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Asunto del Correo</label>
                  <input
                    type="text"
                    required
                    placeholder="Línea de asunto..."
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Categoría</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      placeholder="Ej: Nurturing, Cold Outreach..."
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Segmento Audiencia</label>
                    <input
                      type="text"
                      value={newSegment}
                      onChange={e => setNewSegment(e.target.value)}
                      placeholder="Ej: Dueños de negocios DMV..."
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Fecha Asignada</label>
                    <input
                      type="date"
                      value={newSentDate}
                      onChange={e => setNewSentDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Open Rate (Opcional)</label>
                    <input
                      type="text"
                      value={newOpenRate}
                      onChange={e => setNewOpenRate(e.target.value)}
                      placeholder="Ej: 45% (o dejar vacío)"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>CTR % (Opcional)</label>
                    <input
                      type="text"
                      value={newClickRate}
                      onChange={e => setNewClickRate(e.target.value)}
                      placeholder="Ej: 12% (o dejar vacío)"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Texto / Contenido del Mensaje</label>
                  <textarea
                    rows={5}
                    value={newBodyText}
                    onChange={e => setNewBodyText(e.target.value)}
                    placeholder="Contenido exacto del email..."
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12.5px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Nota de Aprendizaje para la IA</label>
                  <input
                    type="text"
                    value={newAiNotes}
                    onChange={e => setNewAiNotes(e.target.value)}
                    placeholder="Ej: El gancho inicial generó alta conversión."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Registrar en Historial</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
