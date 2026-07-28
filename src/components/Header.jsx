import React from 'react';
import { Download, Upload, Plus, Search, ShieldCheck } from 'lucide-react';
import { db } from '../db/database';

export default function Header({ activeTab, onOpenNewModal, onNotification }) {
  const getTabInfo = () => {
    switch (activeTab) {
      case 'tasks': return { title: 'Centralizador de Tareas & Operaciones', subtitle: 'Optimización de flujo de trabajo mensual en bloque para Resguardo' };
      case 'calendar': return { title: 'Calendario de Emails Programados', subtitle: 'Planificación visual de campañas y secuenciación en GoHighLevel' };
      case 'content': return { title: 'Gestor & Editor de Contenido de Email', subtitle: 'Redacción, previsualización y maquetación fina de correos' };
      case 'templates': return { title: 'Galería de Plantillas IA (Estilo MacOS)', subtitle: 'Catálogo dinámico de plantillas generadas por IA para variación rápida' };
      case 'history': return { title: 'Historial de Correos & Dataset para IA', subtitle: 'Registro histórico y exportador de datos para entrenamiento de IA' };
      case 'agileweb': return { title: 'Generador Web Ágil & Satélites', subtitle: 'Construcción exprés de landing pages y sitios de captura' };
      default: return { title: 'Resguardo Hub', subtitle: 'Plataforma Operativa' };
    }
  };

  const { title, subtitle } = getTabInfo();

  // Export DB backup as JSON
  const handleExportDB = async () => {
    try {
      const templates = await db.templates.toArray();
      const scheduledEmails = await db.scheduledEmails.toArray();
      const emailHistory = await db.emailHistory.toArray();
      const tasks = await db.tasks.toArray();

      const exportData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        templates,
        scheduledEmails,
        emailHistory,
        tasks
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `resguardo_local_db_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      onNotification('Backup exportado exitosamente a JSON.');
    } catch (err) {
      console.error(err);
      onNotification('Error al exportar backup local.');
    }
  };

  return (
    <header className="top-header">
      <div className="header-title-group">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600', padding: '4px 10px', background: '#dcfce7', borderRadius: '20px' }}>
          <ShieldCheck size={14} /> Local IndexedDB (No Supabase)
        </div>

        <button className="btn btn-secondary btn-sm" onClick={handleExportDB} title="Exportar copia de seguridad JSON">
          <Download size={15} /> Exportar JSON
        </button>

        <button className="btn btn-primary btn-sm" onClick={onOpenNewModal}>
          <Plus size={15} /> Crear Nuevo
        </button>
      </div>
    </header>
  );
}
