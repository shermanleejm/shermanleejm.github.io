import { MTGDatabase, MTGDecksDatabase } from '../../database';
import { DatabaseAction } from '../actions';
import { DatabaseActionType } from '../actions/action-types';

const databaseDefault = new MTGDatabase();
const decksDatabase = new MTGDecksDatabase();

export const DatabaseReducer = (state = databaseDefault, action: DatabaseAction) => {
  return state;
};

export const DecksDatabaseReducer = (state = decksDatabase, action: DatabaseAction) => {
  return state;
};
