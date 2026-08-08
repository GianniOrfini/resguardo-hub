import Dexie from 'dexie';
import initialBackupData from './backup_data.json';

export const db = new Dexie('ResguardoHubDB');

// Define version 1
db.version(1).stores({
  templates: '++id, name, category, targetAudience, rating, createdAt, isAiGenerated',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt'
});

// Define version 3 for Encyclopedia and API Settings
db.version(3).stores({
  templates: '++id, name, category, targetAudience, rating, createdAt, isAiGenerated',
  categories: '++id, name',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt',
  encyclopediaProducts: '++id, name, category, priceRange, productionTime, specs',
  encyclopediaPersonas: '++id, title, industry, location, painPoints, buyingTriggers',
  encyclopediaBrandVoice: '++id, phrase, category, type, recommendation',
  apiSettings: 'key, value'
});

db.on('populate', async () => {
  console.log('Seeding initial data...');
  if (initialBackupData.categories?.length) await db.categories.bulkAdd(initialBackupData.categories);
  if (initialBackupData.templates?.length) await db.templates.bulkAdd(initialBackupData.templates);
  if (initialBackupData.scheduledEmails?.length) await db.scheduledEmails.bulkAdd(initialBackupData.scheduledEmails);
  if (initialBackupData.emailHistory?.length) await db.emailHistory.bulkAdd(initialBackupData.emailHistory);
  if (initialBackupData.tasks?.length) await db.tasks.bulkAdd(initialBackupData.tasks);
  await seedEncyclopediaData();
});

export async function seedEncyclopediaData() {
  try {
    const prodCount = await db.encyclopediaProducts.count();
    if (prodCount === 0) {
      await db.encyclopediaProducts.bulkAdd([
        {
          name: 'Cartelería Fachada Exterior 3M Direct-Print',
          category: 'Signage & Displays',
          priceRange: '$800 - $3,500 USD',
          productionTime: '3-5 Días Hábiles',
          specs: 'Sustrato de Dibond aluminio de 4mm, impresión solvente 1440dpi UV con laminado brillante de alta durabilidad outdoor.',
          keyBenefit: 'Fachada impactante visible a 100+ metros, resistente a la intemperie y rayos UV por 7+ años.'
        },
        {
          name: 'Vinilo Microperforado para Ventanales Comerciales',
          category: 'Window Graphics',
          priceRange: '$350 - $1,200 USD',
          productionTime: '2 Días Hábiles',
          specs: 'Película vinílica microperforada 60/40 con tinta UV. Visión 100% clara desde el interior, privacidad y publicidad 100% exterior.',
          keyBenefit: 'Convierte ventanales en atracciones comerciales sin perder luz natural interior.'
        },
        {
          name: 'Rotulación Integral de Flotas & Vehículos Comerciales',
          category: 'Vehicle Wraps',
          priceRange: '$1,500 - $4,800 USD por vehículo',
          productionTime: '4-7 Días Hábiles',
          specs: 'Vinilo fundido Cast 3M IJ180mC con laminado antipiedra/grava. Moldeo 3D térmico en parachoques y curvas.',
          keyBenefit: 'Genera de 30.000 a 70.000 impresiones de marca diarias por las autopistas de Maryland.'
        },
        {
          name: 'Letras Corpóreas LED Retroiluminadas (Channel Letters)',
          category: 'Architectural Signs',
          priceRange: '$2,200 - $8,500 USD',
          productionTime: '10-14 Días Hábiles',
          specs: 'Aluminio soldado 0.063", frente de acrílico impact-resistant con iluminación LED Samsung IP67 de bajo consumo.',
          keyBenefit: 'Presencia nocturna de alto nivel corporativo y elegancia garantizada.'
        }
      ]);
    }

    const personaCount = await db.encyclopediaPersonas.count();
    if (personaCount === 0) {
      await db.encyclopediaPersonas.bulkAdd([
        {
          title: 'Dueños de Restaurantes & Gastronomía en Maryland',
          industry: 'Hospitality & Food',
          location: 'Silver Spring / Bethesda / Rockville, MD',
          painPoints: 'Baja visibilidad nocturna desde la calle, fachadas anticuadas que no transmiten higiene o calidad.',
          buyingTriggers: 'Apertura de nueva sucursal, renovación de menú, competencia directa abriendo cerca.'
        },
        {
          title: 'Contratistas de Construcción & Roofing',
          industry: 'Trades & Services',
          location: 'Montgomery County & Prince George’s, MD',
          painPoints: 'Camionetas sin rotular que parecen informales, pérdida de confianza al cotizar trabajos de $10.000+ USD.',
          buyingTriggers: 'Compra de flota nueva, ganas de cerrar contratos residenciales de alto valor.'
        },
        {
          title: 'Tiendas Retail & Locales Comerciales B2B',
          industry: 'Retail & Commercial Services',
          location: 'Baltimore & Washington DC Metro Area',
          painPoints: 'Paso peatonal que ignora la vitrina, promociones que pasan desapercibidas.',
          buyingTriggers: 'Campaña de temporada, rebajas, cambio de imagen de marca.'
        }
      ]);
    }

    const voiceCount = await db.encyclopediaBrandVoice.count();
    if (voiceCount === 0) {
      await db.encyclopediaBrandVoice.bulkAdd([
        { phrase: 'Atraer clientes reales desde la calle', category: 'Beneficio', type: 'Approved', recommendation: 'Usar siempre en lugar de términos de impresión técnicos.' },
        { phrase: 'Garantía anti-desteñido por 5 años en Maryland', category: 'Confianza', type: 'Approved', recommendation: 'Refuerza la durabilidad local.' },
        { phrase: 'Soluciones llave en mano de producción e instalación', category: 'Servicio', type: 'Approved', recommendation: 'Destaca que Resguardo hace todo el trabajo.' },
        { phrase: 'Synergy, Game-Changer, Next-Gen, Revolutionary', category: 'AI Slop', type: 'Forbidden', recommendation: 'Prohibido usar palabras cliché vacías de la IA.' },
        { phrase: 'Impresión solvente 1440dpi en sustrato sintético', category: 'Técnico', type: 'Forbidden', recommendation: 'Sustituir por el resultado comercial para el cliente.' }
      ]);
    }
  } catch (err) {
    console.error('Error seeding encyclopedia data:', err);
  }
}

// Helper function to safely merge August 2026 email history into IndexedDB and clean up fake metrics
export async function syncAugustEmailHistory() {
  try {
    await seedEncyclopediaData();
    const existingHistory = await db.emailHistory.toArray();
    const existingSubjects = new Set(existingHistory.map(h => h.subject));

    const newEntries = (initialBackupData.emailHistory || []).filter(item => !existingSubjects.has(item.subject));

    if (newEntries.length > 0) {
      await db.emailHistory.bulkAdd(newEntries);
      console.log(`Successfully synced ${newEntries.length} new August email history items.`);
    }

    // Update any existing items with updated htmlBody and addedAt from backup_data
    for (const item of existingHistory) {
      const match = (initialBackupData.emailHistory || []).find(b => b.subject === item.subject);
      if (match) {
        await db.emailHistory.update(item.id, {
          htmlBody: match.htmlBody,
          bodyText: match.bodyText,
          addedAt: match.addedAt || '2026-08-02',
          openRate: match.openRate || null,
          clickRate: match.clickRate || null
        });
      }
    }
  } catch (err) {
    console.error('Error syncing August email history:', err);
  }
}

