import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Tag, Send } from 'lucide-react';

export default function EmailCalendar({ onSelectEmail, onNotification }) {
  const scheduledEmails = useLiveQuery(() => db.scheduledEmails.toArray(), []) || [];
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026

  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Calculate calendar grid days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ dayNumber: null, isOtherMonth: true });
  }
  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const formattedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayEvents = scheduledEmails.filter(e => e.scheduledDate && e.scheduledDate.startsWith(formattedDateStr));
    calendarDays.push({
      dayNumber: d,
      dateStr: formattedDateStr,
      isOtherMonth: false,
      events: dayEvents
    });
  }

  return (
    <div>
      {/* Calendar Header Controls */}
      <div className="macos-toolbar" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CalendarIcon size={20} style={{ color: 'var(--accent-blue)' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
            {monthNames[month]} {year}
          </h2>
          <div style={{ display: 'flex', gap: '4px', marginLeft: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <button className="btn btn-secondary btn-sm" onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-blue">Programados: {scheduledEmails.filter(e => e.status === 'Programado').length}</span>
          <span className="badge badge-gray">Borradores: {scheduledEmails.filter(e => e.status === 'Borrador').length}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="calendar-day-head">{day}</div>
        ))}

        {calendarDays.map((cell, idx) => (
          <div
            key={idx}
            className={`calendar-cell ${cell.isOtherMonth ? 'calendar-cell-other-month' : ''}`}
          >
            {cell.dayNumber && (
              <div className="calendar-date-number">{cell.dayNumber}</div>
            )}

            {cell.events && cell.events.map(ev => (
              <div
                key={ev.id}
                className="calendar-event-badge"
                onClick={() => onSelectEmail(ev)}
                title={`${ev.subject} (${ev.scheduledDate})`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Send size={10} />
                  <span style={{ fontWeight: '700' }}>
                    {ev.scheduledDate ? ev.scheduledDate.slice(11, 16) : ''}
                  </span>
                </div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {ev.subject}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Scheduled Emails Summary Table below calendar */}
      <div style={{ marginTop: '30px', background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border-color)', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
          Lista de Envíos Programados (GoHighLevel)
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px' }}>Asunto</th>
              <th style={{ padding: '10px' }}>Fecha & Hora</th>
              <th style={{ padding: '10px' }}>Categoría</th>
              <th style={{ padding: '10px' }}>Segmento Audiencia</th>
              <th style={{ padding: '10px' }}>Estado</th>
              <th style={{ padding: '10px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {scheduledEmails.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 10px', fontWeight: '600' }}>{item.subject}</td>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{item.scheduledDate}</td>
                <td style={{ padding: '12px 10px' }}><span className="badge badge-gray">{item.category}</span></td>
                <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{item.segment}</td>
                <td style={{ padding: '12px 10px' }}>
                  <span className={`badge ${item.status === 'Programado' ? 'badge-blue' : 'badge-amber'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => onSelectEmail(item)}>
                    Editar Contenido
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
