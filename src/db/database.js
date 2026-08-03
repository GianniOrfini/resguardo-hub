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

// Define version 2
db.version(2).stores({
  templates: '++id, name, category, targetAudience, rating, createdAt, isAiGenerated',
  categories: '++id, name',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt'
});

db.on('populate', async () => {
  console.log('Seeding initial data...');
  if (initialBackupData.categories?.length) await db.categories.bulkAdd(initialBackupData.categories);
  if (initialBackupData.templates?.length) await db.templates.bulkAdd(initialBackupData.templates);
  if (initialBackupData.scheduledEmails?.length) await db.scheduledEmails.bulkAdd(initialBackupData.scheduledEmails);
  if (initialBackupData.emailHistory?.length) await db.emailHistory.bulkAdd(initialBackupData.emailHistory);
  if (initialBackupData.tasks?.length) await db.tasks.bulkAdd(initialBackupData.tasks);
});

// Helper function to safely merge August 2026 email history into IndexedDB and clean up fake metrics
export async function syncAugustEmailHistory() {
  try {
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
