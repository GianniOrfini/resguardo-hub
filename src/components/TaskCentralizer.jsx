import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { CheckCircle2, Circle, Clock, Plus, Zap, AlertCircle, Trash2 } from 'lucide-react';

export default function TaskCentralizer({ onNotification }) {
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || [];
  const [filterCategory, setFilterCategory] = useState('Todos');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Gestión de Contenido');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Media');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = ['Todos', 'Gestión de Contenido', 'Email Marketing', 'Soporte Técnico', 'Proyectos a Demanda'];

  const filteredTasks = tasks.filter(t => filterCategory === 'Todos' || t.category === filterCategory);

  const pendingCount = tasks.filter(t => t.status !== 'Completado').length;
  const completedCount = tasks.filter(t => t.status === 'Completado').length;

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'Completado' ? 'Pendiente' : 'Completado';
    await db.tasks.update(task.id, { status: newStatus });
    onNotification(`Tarea "${task.title}" marcada como ${newStatus}.`);
  };

  const deleteTask = async (id) => {
    await db.tasks.delete(id);
    onNotification('Tarea eliminada.');
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
    onNotification('Nueva tarea agregada al tablero.');
  };

  return (
    <div>
      {/* Top Metrics Banner */}
      <div className="grid-dashboard">
        <div className="metric-card">
          <div className="metric-header">
            <span>Tareas Pendientes</span>
            <Clock size={18} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div className="metric-value">{pendingCount}</div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Por completar este mes</span>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span>Tareas Completadas</span>
            <CheckCircle2 size={18} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div className="metric-value">{completedCount}</div>
          <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600' }}>Eficiencia al {(completedCount + pendingCount > 0) ? Math.round((completedCount / (completedCount + pendingCount)) * 100) : 0}%</span>
        </div>

        <div className="metric-card" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#ffffff' }}>
          <div className="metric-header" style={{ color: '#9ca3af' }}>
            <span>Estrategia Operativa</span>
            <Zap size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '6px', lineHeight: '1.4' }}>
            Modo Batching Activo: Redacta y maqueta todos los artículos y campañas en 1 o 2 días en bloque.
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Add */}
      <div className="macos-toolbar" style={{ marginBottom: '20px' }}>
        <div className="macos-pill-filters">
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

        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={14} /> Nueva Tarea
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTask} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 180px 140px 120px auto', gap: '12px', alignItems: 'center' }}>
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

      {/* Task List */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
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
                    justifyConstraint: 'space-between',
                    padding: '16px 20px',
                    borderBottom: idx === filteredTasks.length - 1 ? 'none' : '1px solid var(--border-color)',
                    backgroundColor: isDone ? '#f9fafb' : '#ffffff',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <button
                      onClick={() => toggleTaskStatus(t)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDone ? 'var(--accent-green)' : 'var(--text-muted)' }}
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
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.6 }}
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
  );
}
