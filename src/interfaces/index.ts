export interface ScryfallDataType {
  object: string;
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  mtgo_id: number;
  arena_id: number;
  tcgplayer_id: number;
  cardmarket_id: number;
  name: string;
  lang: string;
  released_at: string;
  uri: string;
  scryfall_uri: string;
  layout: string;
  highres_image: boolean;
  image_status: string;
  image_uris: ImageUris | undefined;
  mana_cost: string;
  cmc: number;
  type_line: string;
  oracle_text: string;
  power: string;
  toughness: string;
  colors?: string[];
  color_identity: string[];
  keywords: string[];
  legalities: { [key: string]: Legality };
  games: string[];
  reserved: boolean;
  foil: boolean;
  nonfoil: boolean;
  finishes: string[];
  oversized: boolean;
  promo: boolean;
  reprint: boolean;
  variation: boolean;
  set_id: string;
  set: string;
  set_name: string;
  set_type: string;
  set_uri: string;
  set_search_uri: string;
  scryfall_set_uri: string;
  rulings_uri: string;
  prints_search_uri: string;
  collector_number: string;
  digital: boolean;
  rarity: string;
  watermark: string;
  card_back_id: string;
  artist: string;
  artist_ids: string[];
  illustration_id: string;
  border_color: string;
  frame: string;
  frame_effects: string[];
  security_stamp: string;
  full_art: boolean;
  textless: boolean;
  booster: boolean;
  story_spotlight: boolean;
  edhrec_rank: number;
  preview: Preview;
  prices: { [key: string]: null | string };
  related_uris: RelatedUris;
  purchase_uris: PurchaseUris;
  card_faces?: CardFaces[];
}

export interface CardFaces {
  artist: string;
  artist_id: string;
  colors: string[];
  illustration_id: string;
  image_uris: ImageUris;
  mana_cost: string;
  name: string;
  object: string;
  oracle_text: string;
  type_line: string;
}

export interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export enum Legality {
  Legal = 'legal',
  NotLegal = 'not_legal',
}

export interface Preview {
  source: string;
  source_uri: string;
  previewed_at: string;
}

export interface PurchaseUris {
  tcgplayer: string;
  cardmarket: string;
  cardhoarder: string;
}

export interface RelatedUris {
  gatherer: string;
  tcgplayer_infinite_articles: string;
  tcgplayer_infinite_decks: string;
  edhrec: string;
  mtgtop8: string;
}

export interface Prices {
  usd: string | null;
  usd_foil: string | null;
  usd_etched: string | null;
  eur: string | null;
  eur_foil: string | null;
  tix: string | null;
}

export enum PricesKeys {
  usd = 'usd',
  usd_foil = 'usd_foil',
  usd_etched = 'usd_etched',
}

const _example = {
  object: 'card',
  id: '921e3dc3-f8eb-4498-a6a8-b424952230cd',
  oracle_id: 'd654dd73-763d-4dfb-a30f-a058fd7f27a6',
  multiverse_ids: [488634],
  mtgo_id: 81175,
  arena_id: 72050,
  tcgplayer_id: 215402,
  cardmarket_id: 467869,
  name: 'Liliana, Death Mage',
  lang: 'en',
  released_at: '2020-07-03',
  uri: 'https://api.scryfall.com/cards/921e3dc3-f8eb-4498-a6a8-b424952230cd',
  scryfall_uri: 'https://scryfall.com/card/m21/328/liliana-death-mage?utm_source=api',
  layout: 'normal',
  highres_image: true,
  image_status: 'highres_scan',
  image_uris: {
    small:
      'https://c1.scryfall.com/file/scryfall-cards/small/front/9/2/921e3dc3-f8eb-4498-a6a8-b424952230cd.jpg?1596167418',
    normal:
      'https://c1.scryfall.com/file/scryfall-cards/normal/front/9/2/921e3dc3-f8eb-4498-a6a8-b424952230cd.jpg?1596167418',
    large:
      'https://c1.scryfall.com/file/scryfall-cards/large/front/9/2/921e3dc3-f8eb-4498-a6a8-b424952230cd.jpg?1596167418',
    png: 'https://c1.scryfall.com/file/scryfall-cards/png/front/9/2/921e3dc3-f8eb-4498-a6a8-b424952230cd.png?1596167418',
    art_crop:
      'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/9/2/921e3dc3-f8eb-4498-a6a8-b424952230cd.jpg?1596167418',
    border_crop:
      'https://c1.scryfall.com/file/scryfall-cards/border_crop/front/9/2/921e3dc3-f8eb-4498-a6a8-b424952230cd.jpg?1596167418',
  },
  mana_cost: '{4}{B}{B}',
  cmc: 6,
  type_line: 'Legendary Planeswalker — Liliana',
  oracle_text:
    '+1: Return up to one target creature card from your graveyard to your hand.\n−3: Destroy target creature. Its controller loses 2 life.\n−7: Target opponent loses 2 life for each creature card in their graveyard.',
  loyalty: '4',
  colors: ['B'],
  color_identity: ['B'],
  keywords: [],
  all_parts: [
    {
      object: 'related_card',
      id: '921e3dc3-f8eb-4498-a6a8-b424952230cd',
      component: 'combo_piece',
      name: 'Liliana, Death Mage',
      type_line: 'Legendary Planeswalker — Liliana',
      uri: 'https://api.scryfall.com/cards/921e3dc3-f8eb-4498-a6a8-b424952230cd',
    },
    {
      object: 'related_card',
      id: 'b231f941-4acb-46f2-81ae-16e5a28e65af',
      component: 'combo_piece',
      name: "Liliana's Scorn",
      type_line: 'Sorcery',
      uri: 'https://api.scryfall.com/cards/b231f941-4acb-46f2-81ae-16e5a28e65af',
    },
  ],
  legalities: {
    standard: 'not_legal',
    future: 'not_legal',
    historic: 'legal',
    gladiator: 'legal',
    pioneer: 'legal',
    modern: 'legal',
    legacy: 'legal',
    pauper: 'not_legal',
    vintage: 'legal',
    penny: 'legal',
    commander: 'legal',
    brawl: 'not_legal',
    historicbrawl: 'legal',
    alchemy: 'not_legal',
    paupercommander: 'not_legal',
    duel: 'legal',
    oldschool: 'not_legal',
    premodern: 'not_legal',
  },
  games: ['arena', 'paper', 'mtgo'],
  reserved: false,
  foil: true,
  nonfoil: false,
  finishes: ['foil'],
  oversized: false,
  promo: false,
  reprint: false,
  variation: false,
  set_id: 'bc94aba1-7376-4e02-a12d-3a2efb66ab0f',
  set: 'm21',
  set_name: 'Core Set 2021',
  set_type: 'core',
  set_uri: 'https://api.scryfall.com/sets/bc94aba1-7376-4e02-a12d-3a2efb66ab0f',
  set_search_uri:
    'https://api.scryfall.com/cards/search?order=set&q=e%3Am21&unique=prints',
  scryfall_set_uri: 'https://scryfall.com/sets/m21?utm_source=api',
  rulings_uri:
    'https://api.scryfall.com/cards/921e3dc3-f8eb-4498-a6a8-b424952230cd/rulings',
  prints_search_uri:
    'https://api.scryfall.com/cards/search?order=released&q=oracleid%3Ad654dd73-763d-4dfb-a30f-a058fd7f27a6&unique=prints',
  collector_number: '328',
  digital: false,
  rarity: 'mythic',
  card_back_id: '0aeebaf5-8c7d-4636-9e82-8c27447861f7',
  artist: 'Kieran Yanner',
  artist_ids: ['aa7e89ed-d294-4633-9057-ce04dacfcfa4'],
  illustration_id: '69515c21-9baa-4164-b0f0-7708e047fc45',
  border_color: 'black',
  frame: '2015',
  security_stamp: 'oval',
  full_art: false,
  textless: false,
  booster: false,
  story_spotlight: false,
  promo_types: ['planeswalkerdeck'],
  edhrec_rank: 10075,
  preview: {
    source: 'CBR.com',
    source_uri:
      'https://www.cbr.com/magic-the-gathering-planeswalker-decks-core-set-2021/',
    previewed_at: '2020-06-05',
  },
  prices: {
    usd: null,
    usd_foil: '7.90',
    usd_etched: null,
    eur: null,
    eur_foil: '8.04',
    tix: '0.03',
  },
  related_uris: {
    gatherer: 'https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=488634',
    tcgplayer_infinite_articles:
      'https://infinite.tcgplayer.com/search?contentMode=article&game=magic&partner=scryfall&q=Liliana%2C+Death+Mage&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
    tcgplayer_infinite_decks:
      'https://infinite.tcgplayer.com/search?contentMode=deck&game=magic&partner=scryfall&q=Liliana%2C+Death+Mage&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
    edhrec: 'https://edhrec.com/route/?cc=Liliana%2C+Death+Mage',
    mtgtop8:
      'https://mtgtop8.com/search?MD_check=1&SB_check=1&cards=Liliana%2C+Death+Mage',
  },
  purchase_uris: {
    tcgplayer:
      'https://shop.tcgplayer.com/product/productsearch?id=215402&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall',
    cardmarket:
      'https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=Liliana%2C+Death+Mage&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall',
    cardhoarder:
      'https://www.cardhoarder.com/cards/81175?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall',
  },
};
