import React, { useState } from 'react';
import { checkDNSStatus } from '../utils/deliverabilityChecker';
import { ShieldCheck, AlertTriangle, CheckCircle, Copy, X, Server, Lock } from 'lucide-react';

export default function DNSStatusModal({ onClose, onNotification }) {
  const dnsInfo = checkDNSStatus();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    if (onNotification) onNotification(`Registro ${fieldName} copiado al portapapeles.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '680px', width: '90%', padding: '24px', borderRadius: '16px' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={22} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                Auditoría DNS & Entregabilidad Anti-Spam
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Dominio: <strong>{dnsInfo.domain}</strong> (GoDaddy / Cloudflare)
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Status Header Banner */}
          <div style={{ background: '#f8fafc', border: '1.5px inset var(--border-color)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Estado General de Autenticación de Email
              </div>
              <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '2px', fontWeight: '600' }}>
                ✓ Dominio protegido contra suplantación y carpetas de Spam
              </div>
            </div>
            <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '6px 12px' }}>
              <ShieldCheck size={14} /> Dominio Verificado
            </span>
          </div>

          {/* Records Breakdown */}
          {/* SPF */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="#16a34a" />
                <strong style={{ fontSize: '14px' }}>Registro SPF (Sender Policy Framework)</strong>
              </div>
              <span className="badge badge-blue">{dnsInfo.spf.type}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {dnsInfo.spf.recommendation}
            </div>
            <div style={{ background: '#1e293b', color: '#f8fafc', fontFamily: 'monospace', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ overflowX: 'auto' }}>{dnsInfo.spf.record}</span>
              <button 
                className="btn btn-xs btn-secondary" 
                onClick={() => handleCopy(dnsInfo.spf.record, 'SPF')}
                style={{ marginLeft: '10px', flexShrink: 0, padding: '4px 8px' }}
              >
                <Copy size={12} /> {copiedField === 'SPF' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* DKIM */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="#16a34a" />
                <strong style={{ fontSize: '14px' }}>Registro DKIM (DomainKeys Identified Mail)</strong>
              </div>
              <span className="badge badge-blue">{dnsInfo.dkim.type}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {dnsInfo.dkim.recommendation}
            </div>
            <div style={{ background: '#1e293b', color: '#f8fafc', fontFamily: 'monospace', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ overflowX: 'auto' }}>{dnsInfo.dkim.record}</span>
              <button 
                className="btn btn-xs btn-secondary" 
                onClick={() => handleCopy(dnsInfo.dkim.record, 'DKIM')}
                style={{ marginLeft: '10px', flexShrink: 0, padding: '4px 8px' }}
              >
                <Copy size={12} /> {copiedField === 'DKIM' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* DMARC */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f59e0b" />
                <strong style={{ fontSize: '14px' }}>Registro DMARC (Políticas de Seguridad)</strong>
              </div>
              <span className="badge badge-amber">{dnsInfo.dmarc.type}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {dnsInfo.dmarc.recommendation}
            </div>
            <div style={{ background: '#1e293b', color: '#f8fafc', fontFamily: 'monospace', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ overflowX: 'auto' }}>{dnsInfo.dmarc.record}</span>
              <button 
                className="btn btn-xs btn-secondary" 
                onClick={() => handleCopy(dnsInfo.dmarc.record, 'DMARC')}
                style={{ marginLeft: '10px', flexShrink: 0, padding: '4px 8px' }}
              >
                <Copy size={12} /> {copiedField === 'DMARC' ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Entendido & Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
