import { combineReducers } from 'redux';
import BankingReducer from './BankingReducer';
import DarkModeReducer from './DarkModeReducer';
import { DatabaseReducer, DecksDatabaseReducer } from './DatabaseReducer';

const reducers = combineReducers({
  bank: BankingReducer,
  darkMode: DarkModeReducer,
  database: DatabaseReducer,
  decks: DecksDatabaseReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
