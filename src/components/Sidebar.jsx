import React from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Mail, 
  LayoutGrid, 
  History, 
  Globe, 
  Sparkles,
  Database
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
      id: 'calendar',
      label: 'Calendario de Emails',
      icon: Calendar,
      badge: counts.scheduled || 0,
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
      label: 'Plantillas IA (MacOS)',
      icon: LayoutGrid,
      badge: counts.templates || 0,
      group: 'EMAIL MARKETING'
    },
    {
      id: 'history',
      label: 'Historial & Entrenador IA',
      icon: History,
      group: 'EMAIL MARKETING'
    },
    {
      id: 'agileweb',
      label: 'Generador Web Ágil',
      icon: Globe,
      group: 'HERRAMIENTAS FUTURAS'
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
            <Sparkles size={20} />
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
                    <Icon size={18} />
                    <span>{item.label}</span>
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
            <div style={{ fontSize: '13px', fontWeight: '700', truncate: true }}>Gianni</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tech & Marketing Lead</div>
          </div>
          <Database size={15} style={{ color: 'var(--accent-green)' }} title="Base de Datos Local (IndexedDB) Activa" />
        </div>
      </div>
    </aside>
  );
}
