import React, { useRef } from 'react';
import { Download, Upload, Plus, ShieldCheck } from 'lucide-react';
import { db } from '../db/database';

export default function Header({ activeTab, onOpenNewModal, onNotification }) {
  const fileInputRef = useRef(null);

  const getTabInfo = () => {
    switch (activeTab) {
      case 'tasks': return { title: 'Centralizador de Tareas & Operaciones', subtitle: 'Optimización de flujo de trabajo mensual en bloque para Resguardo' };
      case 'calendar': return { title: 'Calendario de Emails Programados', subtitle: 'Planificación visual de campañas y secuenciación en GoHighLevel' };
      case 'yearly': return { title: 'Galería Anual de Emails & Supervisión', subtitle: 'Muros de correos desplegados completos agrupados por año y mes sin distracciones' };
      case 'content': return { title: 'Gestor & Editor de Contenido de Email', subtitle: 'Redacción, previsualización y maquetación fina de correos' };
      case 'templates': return { title: 'Galería de Plantillas IA', subtitle: 'Catálogo dinámico de plantillas generadas por IA para variación rápida' };
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
      const categories = await db.categories.toArray();
      const scheduledEmails = await db.scheduledEmails.toArray();
      const emailHistory = await db.emailHistory.toArray();
      const tasks = await db.tasks.toArray();

      const exportData = {
        version: 2,
        exportedAt: new Date().toISOString(),
        categories,
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

  // Import DB backup from JSON file
  const handleImportFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        let importedTemplatesCount = 0;

        if (Array.isArray(data.templates) && data.templates.length > 0) {
          const cleanTemplates = data.templates.map(({ id, ...rest }) => rest);
          await db.templates.bulkAdd(cleanTemplates);
          importedTemplatesCount = cleanTemplates.length;
        }

        if (Array.isArray(data.categories) && data.categories.length > 0) {
          const cleanCategories = data.categories.map(({ id, ...rest }) => rest);
          await db.categories.bulkAdd(cleanCategories);
        }

        if (Array.isArray(data.scheduledEmails) && data.scheduledEmails.length > 0) {
          const cleanEmails = data.scheduledEmails.map(({ id, ...rest }) => rest);
          await db.scheduledEmails.bulkAdd(cleanEmails);
        }

        if (Array.isArray(data.emailHistory) && data.emailHistory.length > 0) {
          const cleanHistory = data.emailHistory.map(({ id, ...rest }) => rest);
          await db.emailHistory.bulkAdd(cleanHistory);
        }

        if (Array.isArray(data.tasks) && data.tasks.length > 0) {
          const cleanTasks = data.tasks.map(({ id, ...rest }) => rest);
          await db.tasks.bulkAdd(cleanTasks);
        }

        onNotification(`Importación completada: ${importedTemplatesCount} plantillas y datos cargados.`);
      } catch (err) {
        console.error(err);
        onNotification('Error al procesar el archivo JSON de importación.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <header className="top-header">
      <div className="header-title-group">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-green)', fontWeight: '600', padding: '4px 12px', background: '#dcfce7', borderRadius: '20px' }}>
          <ShieldCheck size={14} /> Base de Datos Activa (Local)
        </div>

        {/* Hidden File Input for Import */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleImportFileChange}
          style={{ display: 'none' }}
        />

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => fileInputRef.current?.click()} 
          title="Importar datos desde archivo JSON"
        >
          <Upload size={15} /> Importar JSON
        </button>

        <button 
          className="btn btn-secondary btn-sm" 
          onClick={handleExportDB} 
          title="Exportar copia de seguridad JSON"
        >
          <Download size={15} /> Exportar JSON
        </button>

        <button className="btn btn-primary btn-sm" onClick={onOpenNewModal}>
          <Plus size={15} /> Crear Nuevo
        </button>
      </div>
    </header>
  );
}
