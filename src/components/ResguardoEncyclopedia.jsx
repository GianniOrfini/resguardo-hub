import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { BookOpen, Package, Users, MessageSquare, Search, Plus, Check, ShieldAlert, Sparkles, Tag, Clock } from 'lucide-react';

export default function ResguardoEncyclopedia({ onNotification }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'personas', 'brandvoice'
  const [searchQuery, setSearchQuery] = useState('');

  // Live queries from Dexie
  const products = useLiveQuery(() => db.encyclopediaProducts.toArray(), []) || [];
  const personas = useLiveQuery(() => db.encyclopediaPersonas.toArray(), []) || [];
  const brandVoice = useLiveQuery(() => db.encyclopediaBrandVoice.toArray(), []) || [];

  // Modal states for adding items
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signage & Displays', priceRange: '$500 - $2,000 USD', productionTime: '3-5 Días Hábiles', specs: '', keyBenefit: '' });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;
    await db.encyclopediaProducts.add(newProduct);
    setShowAddProductModal(false);
    setNewProduct({ name: '', category: 'Signage & Displays', priceRange: '$500 - $2,000 USD', productionTime: '3-5 Días Hábiles', specs: '', keyBenefit: '' });
    if (onNotification) onNotification(`Producto "${newProduct.name}" agregado a la Enciclopedia.`);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPersonas = personas.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.industry.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredVoice = brandVoice.filter(v => v.phrase.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Section Description */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '700', margin: 0 }}>
              Enciclopedia & Base de Conocimientos ADN Resguardo
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Repositorio centralizado de productos, buyer personas de Maryland y diccionario de voz de marca ("No AI Slop").
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text"
              placeholder="Buscar en el ADN de Resguardo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '260px' }}
            />
          </div>

          {activeTab === 'products' && (
            <button className="btn btn-primary" onClick={() => setShowAddProductModal(true)}>
              <Plus size={16} /> Agregar Producto
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn btn-sm ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={15} /> Catálogo de Productos ({products.length})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'personas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('personas')}
        >
          <Users size={15} /> Clientes Ideales Maryland ({personas.length})
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'brandvoice' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('brandvoice')}
        >
          <MessageSquare size={15} /> Diccionario Voz de Marca ({brandVoice.length})
        </button>
      </div>

      {/* TAB 1: PRODUCTS CATALOG */}
      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              style={{
                background: '#ffffff',
                border: '1.5px inset var(--border-color)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-blue">{prod.category}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)' }}>{prod.priceRange}</span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>
                  {prod.name}
                </h3>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                  <strong>Especificaciones:</strong> {prod.specs}
                </p>

                <div style={{ background: '#f8fafc', borderLeft: '3px solid #111827', padding: '10px 14px', borderRadius: '4px', fontSize: '12.5px', marginBottom: '14px' }}>
                  <strong>Beneficio Comercial B2B:</strong> {prod.keyBenefit}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <Clock size={14} /> Tiempo de producción: <strong>{prod.productionTime}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BUYER PERSONAS */}
      {activeTab === 'personas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredPersonas.map((pers) => (
            <div key={pers.id} style={{ background: '#ffffff', border: '1.5px inset var(--border-color)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-amber">{pers.industry}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {pers.location}</span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>
                {pers.title}
              </h3>

              <div style={{ fontSize: '13px', marginBottom: '10px' }}>
                <strong style={{ color: '#ef4444' }}>Puntos de Dolor:</strong>
                <p style={{ color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{pers.painPoints}</p>
              </div>

              <div style={{ fontSize: '13px' }}>
                <strong style={{ color: '#16a34a' }}>Detonantes de Compra:</strong>
                <p style={{ color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{pers.buyingTriggers}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BRAND VOICE DICTIONARY */}
      {activeTab === 'brandvoice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#ffffff', border: '1.5px inset var(--border-color)', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>
              Reglas de Lenguaje & ADN de Resguardo ("No AI Slop")
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredVoice.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: item.type === 'Approved' ? '#f0fdf4' : '#fef2f2'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.type === 'Approved' ? (
                      <Check size={18} color="#16a34a" />
                    ) : (
                      <ShieldAlert size={18} color="#ef4444" />
                    )}
                    <div>
                      <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>"{item.phrase}"</strong>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.recommendation}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${item.type === 'Approved' ? 'badge-green' : 'badge-amber'}`}>
                    {item.type === 'Approved' ? 'Aprobada' : 'Prohibida (AI Slop)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay" onClick={() => setShowAddProductModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                Agregar Nuevo Producto a la Enciclopedia
              </h3>
              <button onClick={() => setShowAddProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Nombre del Producto *</label>
                <input 
                  type="text" 
                  required 
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ej. Banners Enrollables Roll-Up Premium"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Rango de Precio</label>
                  <input 
                    type="text" 
                    value={newProduct.priceRange}
                    onChange={e => setNewProduct({ ...newProduct, priceRange: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Tiempo de Producción</label>
                  <input 
                    type="text" 
                    value={newProduct.productionTime}
                    onChange={e => setNewProduct({ ...newProduct, productionTime: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Especificaciones Técnicas</label>
                <textarea 
                  value={newProduct.specs}
                  onChange={e => setNewProduct({ ...newProduct, specs: e.target.value })}
                  placeholder="Ej. Aluminio extruido de 3mm con lona fotográfica anti-arrugas..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Beneficio Comercial B2B</label>
                <input 
                  type="text" 
                  value={newProduct.keyBenefit}
                  onChange={e => setNewProduct({ ...newProduct, keyBenefit: e.target.value })}
                  placeholder="Ej. Portabilidad total en eventos sin desgaste..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddProductModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
