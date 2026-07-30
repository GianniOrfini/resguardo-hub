import Dexie from 'dexie';
import initialBackupData from './backup_data.json';

export const db = new Dexie('ResguardoHubDB');

// Define version 1 (matches original user schema)
db.version(1).stores({
  templates: '++id, name, category, targetAudience, rating, createdAt, isAiGenerated',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt'
});

// Define version 2 (non-breaking upgrade for new categories table)
db.version(2).stores({
  templates: '++id, name, category, targetAudience, rating, createdAt, isAiGenerated',
  categories: '++id, name',
  scheduledEmails: '++id, subject, scheduledDate, status, category, segment',
  emailHistory: '++id, subject, sentDate, openRate, clickRate, category, segment',
  tasks: '++id, title, category, status, dueDate, priority',
  webPresets: '++id, name, type, createdAt'
});

// ZERO RISK POPULATE: 'populate' ONLY runs if the database is 100% new and empty.
// If data already exists in the browser, populate does NOTHING.
db.on('populate', async () => {
  const existingCount = await db.templates.count();
  if (existingCount > 0) {
    console.log('Existing browser data detected. Skipping populate to protect user data.');
    return;
  }

  console.log('Brand new database detected. Seeding fallback initial data...');

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
});
