import Dexie, { Table } from 'dexie';

export interface CardsTableType {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  date_added: number;
  rarity: string;
  set_name: string;
}

export class MTGDatabase extends Dexie {
  public cards!: Table<CardsTableType, number>;

  public constructor() {
    super('mtgdb');
    this.version(1).stores({
      cards: '++id,name,price,quantity,rarity,set_name,date_added',
    });
  }
}
