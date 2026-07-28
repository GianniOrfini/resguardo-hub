import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { History, Sparkles, Download, Plus, Bot, BarChart2, Check, Copy } from 'lucide-react';

export default function EmailHistoryAI({ onNotification }) {
  const historyItems = useLiveQuery(() => db.emailHistory.toArray(), []) || [];

  const [copiedDataset, setCopiedDataset] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New History Item State
  const [newSubject, setNewSubject] = useState('');
  const [newSentDate, setNewSentDate] = useState(new Date().toISOString().slice(0, 10));
  const [newOpenRate, setNewOpenRate] = useState('45%');
  const [newClickRate, setNewClickRate] = useState('12%');
  const [newCategory, setNewCategory] = useState('Cold Outreach');
  const [newSegment, setNewSegment] = useState('Prospectos MD');
  const [newBodyText, setNewBodyText] = useState('');
  const [newAiNotes, setNewAiNotes] = useState('');

  // Generate formatted AI Fine-Tuning / Few-Shot Dataset
  const generateAIDatasetJSON = () => {
    return historyItems.map(item => ({
      instruction: `Redacta un correo electrónico de alta conversión para Resguardo Graphic Designs en la categoría "${item.category}" dirigido a "${item.segment}".`,
      subject: item.subject,
      body: item.bodyText || item.htmlBody,
      performance: {
        open_rate: item.openRate,
        click_rate: item.clickRate
      },
      learnings: item.aiNotes || 'Patrón ganador de conversión.'
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
    const formattedPrompt = `SYSTEM PROMPT: Eres el asistente experto de Email Marketing de Resguardo Graphic Designs. A continuación se presentan los correos pasados con mejor rendimiento para que aprendas el estilo, tono y estructura de la empresa:\n\n` + 
      dataset.map((d, i) => `--- EJEMPLO ${i+1} (${d.performance.open_rate} Open Rate) ---\nASUNTO: ${d.subject}\nCUERPO:\n${d.body}\nAPRENDIZAJE CLAVE: ${d.learnings}\n`).join('\n');

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
      openRate: newOpenRate,
      clickRate: newClickRate,
      category: newCategory,
      segment: newSegment,
      bodyText: newBodyText,
      aiNotes: newAiNotes || 'Registrado manualmente para dataset futuro.'
    });

    setShowAddModal(false);
    setNewSubject('');
    setNewBodyText('');
    onNotification('Nuevo email pasado registrado en el historial para entrenamiento de IA.');
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
            Todos los correos enviados se almacenan localmente. Puedes exportar este historial en 1 clic para entrenar modelos de IA (ChatGPT, Claude o Llama) con tus mejores patrones de conversión.
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
              <th style={{ padding: '12px' }}>Fecha Envió</th>
              <th style={{ padding: '12px' }}>Categoría / Segmento</th>
              <th style={{ padding: '12px' }}>Apertura (Open)</th>
              <th style={{ padding: '12px' }}>Clicks (CTR)</th>
              <th style={{ padding: '12px 16px' }}>Nota / Aprendizaje IA</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                  {item.subject}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400', marginTop: '2px' }}>
                    {item.bodyText ? item.bodyText.slice(0, 70) + '...' : ''}
                  </div>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{item.sentDate}</td>
                <td style={{ padding: '12px' }}>
                  <span className="badge badge-gray">{item.category}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.segment}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="badge badge-green">{item.openRate}</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="badge badge-blue">{item.clickRate}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-purple)', fontWeight: '600' }}>
                    <Bot size={13} /> {item.aiNotes}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Past Email Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                Registrar Email Pasado para Dataset IA
              </h3>
            </div>
            <form onSubmit={handleAddHistorySubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Asunto</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Fecha</label>
                    <input
                      type="date"
                      value={newSentDate}
                      onChange={e => setNewSentDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>Open Rate %</label>
                    <input
                      type="text"
                      value={newOpenRate}
                      onChange={e => setNewOpenRate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700' }}>CTR %</label>
                    <input
                      type="text"
                      value={newClickRate}
                      onChange={e => setNewClickRate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Texto del Mensaje</label>
                  <textarea
                    rows={4}
                    value={newBodyText}
                    onChange={e => setNewBodyText(e.target.value)}
                    placeholder="Contenido exacto del email enviado..."
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
                <button type="submit" className="btn btn-primary">Registrar en Dataset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
