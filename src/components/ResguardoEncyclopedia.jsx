import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { BookOpen, Package, Users, MessageSquare, Search, Plus, Check, ShieldAlert, Sparkles, Tag, Clock, Layers, LayoutGrid, Image, PlusCircle } from 'lucide-react';

export default function ResguardoEncyclopedia({ onNotification }) {
  const [activeTab, setActiveTab] = useState('ui_encyclopedia'); // 'ui_encyclopedia', 'products', 'personas', 'brandvoice'
  const [searchQuery, setSearchQuery] = useState('');
  const [uiLevelFilter, setUiLevelFilter] = useState('all'); // 'all', 'full_page', 'section', 'component'
  const [vibeFilter, setVibeFilter] = useState('all');

  // Live queries from Dexie
  const products = useLiveQuery(() => db.encyclopediaProducts.toArray(), []) || [];
  const personas = useLiveQuery(() => db.encyclopediaPersonas.toArray(), []) || [];
  const brandVoice = useLiveQuery(() => db.encyclopediaBrandVoice.toArray(), []) || [];
  const uiReferences = useLiveQuery(() => db.uiReferences.toArray(), []) || [];

  // Modal states for adding items
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Signage & Displays', priceRange: '$500 - $2,000 USD', productionTime: '3-5 Días Hábiles', specs: '', keyBenefit: '' });

  const [showAddUiModal, setShowAddUiModal] = useState(false);
  const [newUiRef, setNewUiRef] = useState({ title: '', level: 'full_page', category: 'B2B SaaS', vibeTag: 'Linear-minimal', description: '' });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name) return;
    await db.encyclopediaProducts.add(newProduct);
    setShowAddProductModal(false);
    setNewProduct({ name: '', category: 'Signage & Displays', priceRange: '$500 - $2,000 USD', productionTime: '3-5 Días Hábiles', specs: '', keyBenefit: '' });
    if (onNotification) onNotification(`Producto "${newProduct.name}" agregado a la Enciclopedia.`);
  };

  const handleAddUiReference = async (e) => {
    e.preventDefault();
    if (!newUiRef.title) return;
    await db.uiReferences.add(newUiRef);
    setShowAddUiModal(false);
    setNewUiRef({ title: '', level: 'full_page', category: 'B2B SaaS', vibeTag: 'Linear-minimal', description: '' });
    if (onNotification) onNotification(`Referencia UI "${newUiRef.title}" guardada en la Enciclopedia.`);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPersonas = personas.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.industry.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredVoice = brandVoice.filter(v => v.phrase.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const filteredUiRefs = uiReferences.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.vibeTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = uiLevelFilter === 'all' || r.level === uiLevelFilter;
    const matchesVibe = vibeFilter === 'all' || r.vibeTag === vibeFilter;
    return matchesSearch && matchesLevel && matchesVibe;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Section Description */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1.5px inset var(--border-color)', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: '700', margin: 0 }}>
              Enciclopedia UI & Base de Conocimientos ADN Resguardo
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Centralizador de referencias visuales de diseño (3 Niveles), productos, buyer personas de Maryland y voz de marca ("No AI Slop").
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input 
              type="text"
              placeholder="Buscar referencias o productos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', width: '260px' }}
            />
          </div>

          {activeTab === 'ui_encyclopedia' && (
            <button className="btn btn-primary" onClick={() => setShowAddUiModal(true)}>
              <Plus size={16} /> Guardar Referencia UI
            </button>
          )}

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
          className={`btn btn-sm ${activeTab === 'ui_encyclopedia' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('ui_encyclopedia')}
        >
          <LayoutGrid size={15} /> Enciclopedia UI (3 Niveles) ({uiReferences.length})
        </button>

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

      {/* TAB 0: ENCICLOPEDIA UI EN 3 NIVELES */}
      {activeTab === 'ui_encyclopedia' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Filters Bar: Levels & Vibe Tags */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '14px 18px', borderRadius: '12px', border: '1.5px inset var(--border-color)' }}>
            
            {/* Level Selector */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', alignSelf: 'center', marginRight: '6px' }}>Jerarquía UI:</span>
              {[
                { id: 'all', name: 'Todos los Niveles' },
                { id: 'full_page', name: '1. Páginas Enteras' },
                { id: 'section', name: '2. Secciones' },
                { id: 'component', name: '3. Componentes' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  className={`pill-btn ${uiLevelFilter === lvl.id ? 'active' : ''}`}
                  onClick={() => setUiLevelFilter(lvl.id)}
                >
                  {lvl.name}
                </button>
              ))}
            </div>

            {/* Vibe Tag Selector */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', alignSelf: 'center', marginRight: '6px' }}>Vibe / Estilo:</span>
              <select
                value={vibeFilter}
                onChange={e => setVibeFilter(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '12px' }}
              >
                <option value="all">Todos los Vibes</option>
                <option value="Linear-minimal">Linear-minimal</option>
                <option value="Apple-clean">Apple-clean</option>
                <option value="Dark tech">Dark tech</option>
                <option value="Corporate B2B">Corporate B2B</option>
              </select>
            </div>

          </div>

          {/* UI References Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
            {filteredUiRefs.map((ref) => (
              <div
                key={ref.id}
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
                    <span className={`badge ${ref.level === 'full_page' ? 'badge-blue' : ref.level === 'section' ? 'badge-amber' : 'badge-green'}`}>
                      {ref.level === 'full_page' ? 'Página Entera' : ref.level === 'section' ? 'Sección' : 'Componente UI'}
                    </span>
                    <span className="badge badge-gray">{ref.vibeTag}</span>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
                    {ref.title}
                  </h3>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    {ref.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Categoría: {ref.category}</span>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--accent-primary)' }}>
                    Referencia Indexada ✓
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

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

      {/* Add UI Reference Modal */}
      {showAddUiModal && (
        <div className="modal-overlay" onClick={() => setShowAddUiModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: '700' }}>
                Guardar Nueva Referencia Visual en Enciclopedia UI
              </h3>
              <button onClick={() => setShowAddUiModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddUiReference} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Título de la Referencia *</label>
                <input 
                  type="text" 
                  required 
                  value={newUiRef.title}
                  onChange={e => setNewUiRef({ ...newUiRef, title: e.target.value })}
                  placeholder="Ej. Hero de Landing Page Estilo Linear"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Jerarquía UI *</label>
                  <select 
                    value={newUiRef.level}
                    onChange={e => setNewUiRef({ ...newUiRef, level: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  >
                    <option value="full_page">1. Página Entera</option>
                    <option value="section">2. Sección</option>
                    <option value="component">3. Componente UI</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700' }}>Vibe / Estilo *</label>
                  <select 
                    value={newUiRef.vibeTag}
                    onChange={e => setNewUiRef({ ...newUiRef, vibeTag: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                  >
                    <option value="Linear-minimal">Linear-minimal</option>
                    <option value="Apple-clean">Apple-clean</option>
                    <option value="Dark tech">Dark tech</option>
                    <option value="Corporate B2B">Corporate B2B</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700' }}>Descripción del Estilo & Reglas Visuales</label>
                <textarea 
                  value={newUiRef.description}
                  onChange={e => setNewUiRef({ ...newUiRef, description: e.target.value })}
                  placeholder="Ej. Bordes muy finos, degradado radial sutil en el fondo y botón blanco con sombra ligera..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUiModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Referencia</button>
              </div>
            </form>
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
