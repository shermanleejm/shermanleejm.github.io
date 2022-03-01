import Dexie, { Table } from 'dexie';

export interface CustomImageUris {
  small: string[];
  normal: string[];
}

export interface CardsTableType {
  id?: number;
  scryfall_id?: string;
  name: string;
  price: number;
  quantity: number;
  rarity: string;
  set_name: string;
  mana_cost: string;
  cmc: number;
  image_uri: CustomImageUris;
  colors: string[];
  color_identity: string[];
  tags: string[];
  type_line: string;
  oracle_text?: string;
  edhrec_rank?: number;
  date_added: number;
}

export const CardsTableColumns = [
  'id',
  'name',
  'price',
  'quantity',
  'rarity',
  'set_name',
  'mana_cost',
  'cmc',
  'image_uri',
  'colors',
  'color_identity',
  'tags',
  'type_line',
  'oracle_text',
  'date_added',
];

export class MTGDatabase extends Dexie {
  public cards!: Table<CardsTableType, number>;

  public constructor() {
    super('mtgdb');
    this.version(1).stores({
      cards: `++${CardsTableColumns.join(',')}`,
    });
  }
}

export interface DecksTableType {
  id?: number;
  card_id: number;
  name: string;
  format: string;
  is_commander: boolean;
}

export const DecksTableColumns = ['id', 'card_id', 'name', 'format', 'is_commander'];

export class MTGDecksDatabase extends Dexie {
  public decks!: Table<DecksTableType, number>;

  public constructor() {
    super('mtgdb');
    this.version(1).stores({
      decks: `++${DecksTableColumns.join(',')}`,
    });
  }
}
