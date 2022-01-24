import Dexie, { Table } from "dexie";

export interface CardsTableType {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  rarity: string;
  set_name: string;
  mana_cost: string;
  cmc: number;
  image_uri: string;
  colors: string[];
  color_identity: string[];
  tags: string[];
  type_line: string;
  date_added: number;
}

export const CardsTableColumns = [
  "id",
  "name",
  "price",
  "quantity",
  "rarity",
  "set_name",
  "mana_cost",
  "cmc",
  "image_uri",
  "colors",
  "color_identity",
  "tags",
  "type_line",
  "date_added",
];

export class MTGDatabase extends Dexie {
  public cards!: Table<CardsTableType, number>;

  public constructor() {
    super("mtgdb");
    this.version(1).stores({
      cards: `++${CardsTableColumns.join(",")}`,
    });
  }
}
