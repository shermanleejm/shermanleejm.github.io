import Dexie, { Table } from 'dexie';

interface CardsTable {
  id?: number;
  name?: string;
  price?: number;
  quantity?: number;
  date_added?: number;
}

export class MTGDatabase extends Dexie {
  public cards!: Table<CardsTable, number>;

  public constructor() {
    super('mtgdb');
    this.version(1).stores({
      cards: '++id,name,price,quantity,date_added',
    });
  }
}
