// db.ts
import Dexie, { Table } from 'dexie';

// Interfaces
export interface Person {
  id?: number; // Optional because Dexie will auto-generate
  name: string;
  address: string;
}

export interface PhoneNumber {
  id?: number;
  user_id: number; // FK to Person
  label: string;
  number: string;
}

// Custom DB class
class ContactsDB extends Dexie {
  people!: Table<Person, number>;
  numbers!: Table<PhoneNumber, number>;

  constructor() {
    super('ContactsDB');
    this.version(1).stores({
      people: '++id, name, address',
      numbers: '++id, user_id, label, number',
    });
  }
}

export const db = new ContactsDB();
