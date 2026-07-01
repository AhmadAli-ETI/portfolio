import Dexie from 'dexie';

// Datenbank-Definition fuer den Browser (IndexedDB)
export const db = new Dexie('DactylusDB');

// Alte Versionen (fuer Dexie-Migrationen)
db.version(2).stores({
    patients: '++id, name',
    records: '++id, patientId, fingerPeaks, timestamp'
});

// Aktuelle Version mit Finger-Bestleistungen und Reaktionszeiten
db.version(4).stores({
    patients: '++id, name',
    records: '++id, patientId, fingerPeaks, timestamp',
    fingerBests: '++id, patientId',
    reactionRecords: '++id, patientId, fingerIndex, reactionTime, timestamp'
});

