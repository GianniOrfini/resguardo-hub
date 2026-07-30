import Dexie from 'dexie';
import initialBackupData from './backup_data.json';

export const db = new Dexie('ResguardoHubDB');

// Define tables and indexes
db.version(2).stores({
  templates: '++id, name, category, targetAudience, createdAt, isAiGenerated',
  categories: '++id, name',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt'
});

// Populate seed data on first run from backup_data.json
db.on('populate', async () => {
  console.log('Populating IndexedDB from backup_data.json...');

  if (initialBackupData.categories?.length) {
    await db.categories.bulkAdd(initialBackupData.categories);
  }

  if (initialBackupData.templates?.length) {
    await db.templates.bulkAdd(initialBackupData.templates);
  }

  if (initialBackupData.scheduledEmails?.length) {
    await db.scheduledEmails.bulkAdd(initialBackupData.scheduledEmails);
  }

  if (initialBackupData.emailHistory?.length) {
    await db.emailHistory.bulkAdd(initialBackupData.emailHistory);
  }

  if (initialBackupData.tasks?.length) {
    await db.tasks.bulkAdd(initialBackupData.tasks);
  }

  console.log('Database successfully populated from repository seed!');
});
