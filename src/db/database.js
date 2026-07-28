import Dexie from 'dexie';

export const db = new Dexie('ResguardoHubDB');

// Define tables and indexes
db.version(1).stores({
  templates: '++id, name, category, targetAudience, rating, createdAt, isAiGenerated',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt'
});

// Populate seed data on first run
db.on('populate', async () => {
  console.log('Seeding initial database data...');

  // 1. Initial AI Templates (Created by previous tech & newly optimized)
  await db.templates.bulkAdd([
    {
      name: 'B2B Logistics Pitch - Cold Outreach',
      category: 'Cold Outreach',
      targetAudience: 'Directores de Logística / Freight Managers',
      description: 'Plantilla de alta conversión diseñada por el técnico anterior para prospección B2B en Maryland.',
      subject: 'Optimizando la logística de distribución en Maryland | Resguardo',
      preheader: 'Reduce tiempos de entrega y costos operativos con infraestructura dedicada.',
      htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <h2 style="color: #212121; font-weight: 700;">Potencia la Logística de tu Empresa</h2>
  <p>Hola <strong>{{first_name}}</strong>,</p>
  <p>Sabemos que la eficiencia en la cadena de distribución en la región de Maryland es crítica para mantener la competitividad de tu negocio.</p>
  <div style="background-color: #f5f5f7; border-left: 4px solid #212121; padding: 15px; margin: 20px 0;">
    <p style="margin: 0; font-weight: 600;">En Resguardo ofrecemos solución integral de almacenamiento, gestión de flota y cartelería corporativa bajo un mismo estándar de calidad.</p>
  </div>
  <p>¿Te interesaría agendar una breve llamada de 10 minutos esta semana para auditar tus costos logísticos actuales?</p>
  <a href="{{booking_link}}" style="background-color: #212121; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">Agendar Auditoría Gratuita</a>
  <p style="margin-top: 30px; font-size: 12px; color: #666666;">Resguardo Logistics & Graphic Designs - Maryland, US</p>
</div>
      `.trim(),
      rating: 4.9,
      isAiGenerated: true,
      createdAt: '2026-07-01'
    },
    {
      name: 'Cartelería Comercial & Signage - Lead Magnet',
      category: 'Lead Gen',
      targetAudience: 'Dueños de Negocios Físicos / Retail Stores',
      description: 'Plantilla enfocada en la venta de rótulos, vallas y gráfica publicitaria para locales en Maryland.',
      subject: 'Renueva la fachada de tu local comercial antes del próximo trimestre',
      preheader: 'Impacta a tus clientes desde el primer segundo con rótulos de alto rendimiento.',
      htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <h2 style="color: #212121;">Haz que tu Negocio Destaque en la Ciudad</h2>
  <p>Hola <strong>{{first_name}}</strong>,</p>
  <p>El 70% de las ventas en tiendas físicas dependen del impacto visual de su fachada y señalética exterior.</p>
  <p>En Resguardo Graphic Designs fabricamos e instalamos:</p>
  <ul>
    <li>Letreros luminosos LED y cajas de luz</li>
    <li>Vinilos para escaparates y vehículos corporativos</li>
    <li>Cartelería de gran formato e interiorismo comercial</li>
  </ul>
  <p>Responde a este correo con las medidas aproximadas de tu local y te enviaremos una maqueta 3D sin costo.</p>
  <a href="{{portfolio_link}}" style="background-color: #212121; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Ver Portafolio de Proyectos</a>
</div>
      `.trim(),
      rating: 4.8,
      isAiGenerated: true,
      createdAt: '2026-07-10'
    },
    {
      name: 'Onboarding Cliente Nuevo - Bienvenida GHL',
      category: 'Onboarding',
      targetAudience: 'Clientes Registrados en GoHighLevel',
      description: 'Secuencia automatizada de bienvenida para clientes integrados a la plataforma GoHighLevel.',
      subject: '¡Bienvenido a Resguardo! Tu portal de servicios está listo',
      preheader: 'Accede a tus recursos, seguimiento de órdenes y archivos de diseño.',
      htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <h2>¡Es un gusto tenerte con nosotros!</h2>
  <p>Estimado/a <strong>{{first_name}}</strong>,</p>
  <p>Queremos darte la bienvenida a la familia de <strong>Resguardo</strong>. Desde este momento tienes acceso a nuestro equipo de atención y soporte técnico.</p>
  <p>Puedes gestionar tus pedidos, revisar maquetas de diseño o solicitar servicios logísticos haciendo clic en el siguiente enlace:</p>
  <a href="{{portal_link}}" style="background-color: #212121; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Acceder al Portal del Cliente</a>
</div>
      `.trim(),
      rating: 4.7,
      isAiGenerated: true,
      createdAt: '2026-07-15'
    },
    {
      name: 'Boletín Informativo Mensual / Blog Digest',
      category: 'Nurturing',
      targetAudience: 'Base Completa de Suscriptores',
      description: 'Estructura optimizada para la publicación en bloque de los artículos mensuales de blog.',
      subject: 'Novedades de la Industria: Logística Eficiente y Tendencias de Diseño 2026',
      preheader: 'Lee nuestro último artículo y optimiza la visibilidad de tu marca.',
      htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #666666;">RESGUARDO BLOG DIGEST</span>
  <h2 style="margin-top: 5px;">Cómo optimizar tu cadena de distribución local este mes</h2>
  <p>En nuestro último artículo exploramos las principales estrategias de optimización para empresas comerciales...</p>
  <a href="{{blog_url}}" style="color: #212121; font-weight: 700; text-decoration: underline;">Leer artículo completo (4 min) &rarr;</a>
</div>
      `.trim(),
      rating: 4.6,
      isAiGenerated: true,
      createdAt: '2026-07-20'
    },
    {
      name: 'Promoción Flash - Descuento en Impresión & Cartelería',
      category: 'Promocional',
      targetAudience: 'Clientes Frecuentes / Leads Calientes',
      description: 'Email de urgencia para liquidación o promoción de servicios de imprenta corporativa.',
      subject: '⚡ 15% OFF en Cartelería Corporativa - Solo esta semana',
      preheader: 'Renueva tu señalética comercial con precio preferencial de temporada.',
      htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; border: 1px solid #e0e0e0; padding: 24px; border-radius: 12px;">
  <h2 style="color: #d9381e;">Oferta Exclusiva para Clientes Registrados</h2>
  <p>Aprovecha un <strong>15% de descuento directo</strong> en cualquier pedido de gráfica publicitaria o cartelería exterior procesado antes del viernes.</p>
  <a href="{{promo_claim}}" style="background-color: #d9381e; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Reclamar Descuento Ahora</a>
</div>
      `.trim(),
      rating: 4.9,
      isAiGenerated: true,
      createdAt: '2026-07-22'
    },
    {
      name: 'Reactivación de Leads Inactivos (Re-engagement)',
      category: 'Cold Outreach',
      targetAudience: 'Leads sin interacción > 90 días',
      description: 'Secuencia breve de re-interés para evaluar la vigencia del prospecto en GoHighLevel.',
      subject: '¿Aún necesitas apoyo con la gráfica o distribución de tu empresa?',
      preheader: 'Queríamos confirmar si sigues trabajando en nuevos proyectos en MD.',
      htmlBody: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
  <p>Hola <strong>{{first_name}}</strong>,</p>
  <p>Te escribo brevemente porque vimos que hace un tiempo consultaste por nuestros servicios de logística y cartelería corporativa en Resguardo.</p>
  <p>¿Sigues buscando soluciones en esta área o ya resolviste tu necesidad?</p>
  <p>Si respondes a este correo con un "Sí", te enviaré nuestro catálogo actualizado 2026.</p>
</div>
      `.trim(),
      rating: 4.5,
      isAiGenerated: true,
      createdAt: '2026-07-25'
    }
  ]);

  // 2. Scheduled Emails
  await db.scheduledEmails.bulkAdd([
    {
      subject: 'Boletín Agosto: 5 Tendencias de Cartelería Comercial para 2026',
      scheduledDate: '2026-08-05T10:00',
      status: 'Programado',
      category: 'Nurturing',
      segment: 'Base General (GoHighLevel)',
      content: 'Este email presentará el artículo de blog del mes sobre cartelería en Maryland.',
      templateId: 4
    },
    {
      subject: 'Campaña B2B Maryland: Servicios de Logística Dedicada Q3',
      scheduledDate: '2026-08-12T09:30',
      status: 'Programado',
      category: 'Cold Outreach',
      segment: 'Prospectos B2B Maryland',
      content: 'Pitch inicial para gerentes de logística y empresas de distribución.',
      templateId: 1
    },
    {
      subject: 'Seguimiento Automático - Cotizaciones Pendientes de Signage',
      scheduledDate: '2026-08-18T15:00',
      status: 'Borrador',
      category: 'Lead Gen',
      segment: 'Cotizaciones Abiertas GHL',
      content: 'Recordatorio suave para clientes con cotización emitida.',
      templateId: 2
    },
    {
      subject: 'Re-engagement Q3: Actualización de Servicios y Flotas',
      scheduledDate: '2026-08-25T11:00',
      status: 'Borrador',
      category: 'Cold Outreach',
      segment: 'Leads Inactivos (>60 días)',
      content: 'Reactivación de prospectos antiguos.',
      templateId: 6
    }
  ]);

  // 3. Email History (For AI Training)
  await db.emailHistory.bulkAdd([
    {
      subject: 'Optimización de Logística Local en Maryland - Caso de Éxito',
      sentDate: '2026-06-15',
      openRate: '42.5%',
      clickRate: '11.2%',
      category: 'Cold Outreach',
      segment: 'Gerentes de Operaciones MD',
      bodyText: 'Hola {{first_name}}, logramos reducir en un 28% los tiempos de entrega para distribuidoras locales en Maryland. Te compartimos el caso de estudio...',
      aiNotes: 'Excelente tasa de apertura gracias al asunto personalizado por ubicación (Maryland).'
    },
    {
      subject: 'Maquetas 3D sin costo para la fachada de tu negocio',
      sentDate: '2026-06-28',
      openRate: '48.1%',
      clickRate: '15.4%',
      category: 'Lead Gen',
      segment: 'Comercios Minoristas',
      bodyText: 'Hola {{first_name}}, ¿te gustaría ver cómo luciría la fachada de tu local con señalética moderna? Creamos una maqueta digital 3D totalmente gratis.',
      aiNotes: 'Ganador absoluto en respuesta directa. El gancho de la maqueta 3D sin costo genera alto CTR.'
    },
    {
      subject: 'Bienvenido al sistema de gestión de Resguardo Graphic Designs',
      sentDate: '2026-07-02',
      openRate: '68.9%',
      clickRate: '32.1%',
      category: 'Onboarding',
      segment: 'Nuevos Clientes GHL',
      bodyText: 'Estimado/a {{first_name}}, gracias por confiar en Resguardo. Aquí tienes el enlace a tu panel de control...',
      aiNotes: 'Email transaccional de bienvenida con altísima tasa de clic.'
    },
    {
      subject: 'Novedades de Julio: Guía de Mantenimiento de Letreros LED',
      sentDate: '2026-07-15',
      openRate: '38.2%',
      clickRate: '8.4%',
      category: 'Nurturing',
      segment: 'Suscriptores Blog',
      bodyText: 'El mantenimiento preventivo de tus letreros luminosos extiende su vida útil por más de 5 años. Descubre los consejos clave en nuestro blog.',
      aiNotes: 'Buen engagement en contenido técnico de valor.'
    }
  ]);

  // 4. Recurring Operational Tasks
  await db.tasks.bulkAdd([
    {
      title: 'Redacción y Maquetación: Artículo de Blog 1 (Agosto)',
      category: 'Gestión de Contenido',
      status: 'Pendiente',
      dueDate: '2026-08-08',
      priority: 'Alta',
      description: 'Escribir artículo enfocado en tendencias de cartelería e instalar en WordPress / GHL.'
    },
    {
      title: 'Redacción y Maquetación: Artículo de Blog 2 (Agosto)',
      category: 'Gestión de Contenido',
      status: 'Pendiente',
      dueDate: '2026-08-22',
      priority: 'Media',
      description: 'Segundo artículo mensual para soporte de SEO.'
    },
    {
      title: 'Revisión y Programación de Campaña de Email en GoHighLevel',
      category: 'Email Marketing',
      status: 'En Progreso',
      dueDate: '2026-08-04',
      priority: 'Alta',
      description: 'Configurar la secuencia automatizada de correos en la plataforma GHL.'
    },
    {
      title: 'Auditoría de Dominio y Certificados SSL (GoDaddy / Cloudflare)',
      category: 'Soporte Técnico',
      status: 'Completado',
      dueDate: '2026-07-28',
      priority: 'Media',
      description: 'Verificación mensual del funcionamiento de los dominios y sitios satélite.'
    }
  ]);

  // 5. Agile Web Generator Presets
  await db.webPresets.bulkAdd([
    {
      name: 'Landing Page Rápida - Cartelería Comercial',
      type: 'Signage Landing',
      createdAt: '2026-07-28'
    },
    {
      name: 'Sitio Satélite - Servicios de Logística Maryland',
      type: 'Logistics Satellite',
      createdAt: '2026-07-28'
    }
  ]);

  console.log('Seed data successfully created!');
});
