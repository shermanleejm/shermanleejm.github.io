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
  collector_number?: string;
  set?: string;
  power?: string;
  toughness?: string;
  date_added: number;
}

export const CardsTableColumns = [
  'id',
  'scryfall_id',
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
  'collector_number',
  'set',
  'power',
  'toughness',
  'date_added',
];

export interface DecksTableType {
  id?: number;
  card_id: number;
  name: string;
  format: string;
  is_commander: boolean;
  category?: string;
}

export const DecksTableColumns = [
  'id',
  'card_id',
  'name',
  'format',
  'is_commander',
  'category',
];

export enum FormCategories {
  category = 'category',
  name = 'name',
  amount = 'amount',
  datetime = 'datetime',
  isCredit = 'is_credit',
}

export interface ExpenditureTableType {
  id?: number;
  [FormCategories.category]: string;
  [FormCategories.name]: string;
  [FormCategories.amount]: string;
  [FormCategories.datetime]: Date;
  [FormCategories.isCredit]: boolean;
}

export const ExpenditureTableColumns = [
  'id',
  'category',
  'name',
  'amount',
  'datetime',
  'is_credit',
];

export class MTGDatabase extends Dexie {
  public cards!: Table<CardsTableType, number>;
  public decks!: Table<DecksTableType, number>;
  public expenditure!: Table<ExpenditureTableType, number>;

  public constructor() {
    super('mtgdb');
    this.version(3).stores({
      cards: `++${CardsTableColumns.join(',')}`,
      decks: `++${DecksTableColumns.join(',')}`,
      expenditure: `++${ExpenditureTableColumns.join(',')}`,
    });
  }
}
