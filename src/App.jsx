import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db/database';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TaskCentralizer from './components/TaskCentralizer';
import EmailCalendar from './components/EmailCalendar';
import EmailContentEditor from './components/EmailContentEditor';
import TemplateGalleryMacOS from './components/TemplateGalleryMacOS';
import EmailHistoryAI from './components/EmailHistoryAI';
import AgileWebGenerator from './components/AgileWebGenerator';

import { X, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('templates'); // Default to MacOS Photos template gallery!
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showGlobalNewModal, setShowGlobalNewModal] = useState(false);

  // Live DB Queries for Counts
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || [];
  const scheduledEmails = useLiveQuery(() => db.scheduledEmails.toArray(), []) || [];
  const templates = useLiveQuery(() => db.templates.toArray(), []) || [];

  const counts = {
    pendingTasks: tasks.filter(t => t.status !== 'Completado').length,
    scheduled: scheduledEmails.filter(e => e.status === 'Programado').length,
    templates: templates.length
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleSelectEmail = (email) => {
    setSelectedEmail(email);
    setActiveTab('content');
  };

  const handleUseTemplate = (template) => {
    setSelectedEmail({
      subject: template.subject,
      preheader: template.preheader,
      category: template.category,
      segment: template.targetAudience,
      status: 'Borrador',
      content: template.htmlBody
    });
    setActiveTab('content');
    showToast(`Plantilla "${template.name}" cargada en el editor.`);
  };

  return (
    <div className="app-container">
      {/* Toast Notification Bar */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#111827',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-elevated)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 999,
          fontSize: '13px',
          fontWeight: '600',
          animation: 'modalPop 0.2s ease'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', marginLeft: '6px' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Sidebar Nav */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
      />

      {/* Main Viewport */}
      <div className="main-viewport">
        <Header
          activeTab={activeTab}
          onOpenNewModal={() => setShowGlobalNewModal(true)}
          onNotification={showToast}
        />

        <main className="content-body">
          {activeTab === 'tasks' && (
            <TaskCentralizer onNotification={showToast} />
          )}

          {activeTab === 'calendar' && (
            <EmailCalendar
              onSelectEmail={handleSelectEmail}
              onNotification={showToast}
            />
          )}

          {activeTab === 'content' && (
            <EmailContentEditor
              selectedEmail={selectedEmail}
              onNotification={showToast}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateGalleryMacOS
              onUseTemplate={handleUseTemplate}
              onNotification={showToast}
            />
          )}

          {activeTab === 'history' && (
            <EmailHistoryAI onNotification={showToast} />
          )}

          {activeTab === 'agileweb' && (
            <AgileWebGenerator onNotification={showToast} />
          )}
        </main>
      </div>

      {/* Quick Global Action Modal */}
      {showGlobalNewModal && (
        <div className="modal-overlay" onClick={() => setShowGlobalNewModal(false)}>
          <div className="modal-content" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                ¿Qué deseas crear?
              </h3>
              <button onClick={() => setShowGlobalNewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
                onClick={() => {
                  setShowGlobalNewModal(false);
                  setActiveTab('templates');
                }}
              >
                <strong>Nueva Plantilla de Email (IA)</strong>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
                onClick={() => {
                  setShowGlobalNewModal(false);
                  setSelectedEmail({ subject: '', content: '' });
                  setActiveTab('content');
                }}
              >
                <strong>Nuevo Borrador / Correo Programado</strong>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
                onClick={() => {
                  setShowGlobalNewModal(false);
                  setActiveTab('tasks');
                }}
              >
                <strong>Nueva Tarea Operativa (Resguardo)</strong>
              </button>

              <button
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '14px' }}
                onClick={() => {
                  setShowGlobalNewModal(false);
                  setActiveTab('agileweb');
                }}
              >
                <strong>Nueva Landing Page Ágil</strong>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
