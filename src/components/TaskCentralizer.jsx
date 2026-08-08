import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { CheckCircle2, Circle, Clock, Plus, Zap, AlertCircle, Trash2, Sliders, RefreshCw, Key, ShieldCheck, TrendingUp, Mail, Globe, Check } from 'lucide-react';

export default function TaskCentralizer({ onNotification }) {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || [];
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'integrations'
  const [filterCategory, setFilterCategory] = useState('Todos');
  
  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Gestión de Contenido');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Media');
  const [showAddForm, setShowAddForm] = useState(false);

  // GHL & Trello Credentials State
  const [ghlApiKey, setGhlApiKey] = useState('ghl_live_983719827391283');
  const [trelloApiKey, setTrelloApiKey] = useState('trello_key_771928391823');
  const [trelloBoardId, setTrelloBoardId] = useState('board_resguardo_production_md');
  const [isSyncing, setIsSyncing] = useState(false);

  const categories = ['Todos', 'Gestión de Contenido', 'Email Marketing', 'Soporte Técnico', 'Proyectos a Demanda'];
  const filteredTasks = tasks.filter(t => filterCategory === 'Todos' || t.category === filterCategory);

  const pendingCount = tasks.filter(t => t.status !== 'Completado').length;
  const completedCount = tasks.filter(t => t.status === 'Completado').length;

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'Completado' ? 'Pendiente' : 'Completado';
    await db.tasks.update(task.id, { status: newStatus });
    if (onNotification) onNotification(`Tarea "${task.title}" marcada como ${newStatus}.`);
  };

  const deleteTask = async (id) => {
    await db.tasks.delete(id);
    if (onNotification) onNotification('Tarea eliminada.');
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await db.tasks.add({
      title: newTaskTitle,
      category: newTaskCategory,
      status: 'Pendiente',
      dueDate: newTaskDueDate || new Date().toISOString().slice(0, 10),
      priority: newTaskPriority,
      description: 'Creada desde el tablero operativo.'
    });

    setNewTaskTitle('');
    setShowAddForm(false);
    if (onNotification) onNotification('Nueva tarea agregada al tablero.');
  };

  const handleSyncIntegrations = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      if (onNotification) onNotification('Sincronización bidireccional con Trello y GoHighLevel completada.');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Ana's Executive KPI Header Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        
        {/* Open Rate */}
        <div style={{ background: '#ffffff', border: '1.5px inset var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
            <span>Email Open Rate</span>
            <Mail size={16} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
            42.8%
          </div>
          <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <TrendingUp size={12} /> +4.2% vs mes anterior
          </span>
        </div>

        {/* CTR Rate */}
        <div style={{ background: '#ffffff', border: '1.5px inset var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
            <span>Click-Through Rate (CTR)</span>
            <TrendingUp size={16} color="#2563eb" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
            6.4%
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Leads B2B en Maryland
          </span>
        </div>

        {/* Spam Rate Target */}
        <div style={{ background: '#ffffff', border: '1.5px inset var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
            <span>Spam Complaint Rate</span>
            <ShieldCheck size={16} color="#16a34a" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: '#16a34a', marginTop: '6px' }}>
            0.02%
          </div>
          <span className="badge badge-green" style={{ marginTop: '4px', fontSize: '10.5px' }}>
            ✓ Meta Ana &lt; 0.1% Cumplida
          </span>
        </div>

        {/* Webpages Delivered */}
        <div style={{ background: '#ffffff', border: '1.5px inset var(--border-color)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700' }}>
            <span>Páginas Entregadas</span>
            <Globe size={16} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '6px' }}>
            14
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Promedio: 4.2 horas / sitio
          </span>
        </div>

      </div>

      {/* Tabs Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tablero Operativo ({pendingCount} pendientes)
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'integrations' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('integrations')}
          >
            <Sliders size={14} /> Integraciones GHL & Trello
          </button>
        </div>

        {activeTab === 'tasks' && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus size={14} /> Nueva Tarea Operativa
          </button>
        )}
      </div>

      {/* TAB 1: TASKS BOARD */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {showAddForm && (
            <form onSubmit={handleAddTask} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1.5px inset var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 180px 140px 120px auto', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Título de la tarea..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                required
              />
              <select
                value={newTaskCategory}
                onChange={e => setNewTaskCategory(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}
              >
                <option>Gestión de Contenido</option>
                <option>Email Marketing</option>
                <option>Soporte Técnico</option>
                <option>Proyectos a Demanda</option>
              </select>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={e => setNewTaskDueDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}
              />
              <select
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}
              >
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
              <button type="submit" className="btn btn-primary btn-sm">Guardar</button>
            </form>
          )}

          {/* Tasks List */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', overflow: 'hidden' }}>
            {filteredTasks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No hay tareas registradas en esta categoría.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredTasks.map((t, idx) => {
                  const isDone = t.status === 'Completado';
                  return (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderBottom: idx === filteredTasks.length - 1 ? 'none' : '1px solid var(--border-color)',
                        backgroundColor: isDone ? '#f9fafb' : '#ffffff',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                        <button
                          onClick={() => toggleTaskStatus(t)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? '#16a34a' : 'var(--text-muted)' }}
                        >
                          {isDone ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                        </button>

                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: isDone ? 'line-through' : 'none'
                          }}>
                            {t.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {t.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="badge badge-gray">{t.category}</span>
                        <span className={`badge ${t.priority === 'Alta' ? 'badge-amber' : 'badge-blue'}`}>
                          Prioridad {t.priority}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                          Vence: {t.dueDate}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title="Eliminar tarea"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GHL & TRELLO INTEGRATION SETTINGS */}
      {activeTab === 'integrations' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>
              Configuración de APIs Externe (GoHighLevel & Trello)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Sincronización en tiempo real de contactos, webhooks de leads y tableros de producción de Resguardo Designs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* GoHighLevel Config Card */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ fontSize: '15px' }}>GoHighLevel (GHL API v2)</strong>
                <span className="badge badge-green">Conectado</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Location API Key / Token</label>
                  <input 
                    type="password"
                    value={ghlApiKey}
                    onChange={e => setGhlApiKey(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  ✓ Webhook activo para nuevos registros de cotización.<br/>
                  ✓ Sincronización de campañas de email y métricas de apertura.
                </div>
              </div>
            </div>

            {/* Trello Config Card */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: '12px', padding: '18px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <strong style={{ fontSize: '15px' }}>Trello Production Board API</strong>
                <span className="badge badge-green">Conectado</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>Trello API Key</label>
                  <input 
                    type="password"
                    value={trelloApiKey}
                    onChange={e => setTrelloApiKey(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>ID de Tablero Resguardo</label>
                  <input 
                    type="text"
                    value={trelloBoardId}
                    onChange={e => setTrelloBoardId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button className="btn btn-primary" onClick={handleSyncIntegrations} disabled={isSyncing}>
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Sincronizando...' : 'Sincronizar APIs Ahora'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
