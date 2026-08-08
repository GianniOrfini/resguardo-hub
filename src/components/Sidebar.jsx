import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Mail, 
  LayoutGrid, 
  History, 
  CalendarRange,
  Globe, 
  Sparkles,
  Database,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts }) {
  const menuItems = [
    {
      id: 'tasks',
      label: 'Operaciones & Tareas',
      icon: CheckSquare,
      badge: counts.pendingTasks || 0,
      group: 'PRODUCTIVIDAD'
    },
    {
      id: 'encyclopedia',
      label: 'Enciclopedia & ADN',
      icon: BookOpen,
      group: 'BASE DE CONOCIMIENTO'
    },
    {
      id: 'agileweb',
      label: 'Generador Web Ágil',
      icon: Globe,
      group: 'GENERADOR WEB'
    },
    {
      id: 'calendar',
      label: 'Calendario de Emails',
      icon: Calendar,
      badge: counts.scheduled || 0,
      group: 'EMAIL MARKETING'
    },
    {
      id: 'yearly',
      label: 'Galería por Año',
      icon: CalendarRange,
      group: 'EMAIL MARKETING'
    },
    {
      id: 'content',
      label: 'Contenido & Editor',
      icon: Mail,
      group: 'EMAIL MARKETING'
    },
    {
      id: 'templates',
      label: 'Plantillas IA',
      icon: LayoutGrid,
      badge: counts.templates || 0,
      group: 'EMAIL MARKETING'
    },
    {
      id: 'history',
      label: 'Historial & Entrenador IA',
      icon: History,
      group: 'EMAIL MARKETING'
    }
  ];

  const groupedMenu = menuItems.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <aside className="sidebar">
      <div>
        <div className="brand-header">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="brand-title">RESGUARDO</div>
            <div className="brand-subtitle">Operations & Email Hub</div>
          </div>
        </div>

        <nav className="nav-menu">
          {Object.entries(groupedMenu).map(([groupName, items]) => (
            <div key={groupName}>
              <div className="nav-group-label">{groupName}</div>
              {items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">G</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12.5px', fontWeight: '700' }}>Gianni</div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Tech & Marketing Lead</div>
          </div>
          <Database size={14} style={{ color: 'var(--accent-green)' }} title="Base de Datos Local (IndexedDB) Activa" />
        </div>
      </div>
    </aside>
  );
}
