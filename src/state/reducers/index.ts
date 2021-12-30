import { combineReducers } from 'redux';
import BankingReducer from './BankingReducer';
import DarkModeReducer from './DarkModeReducer';

const reducers = combineReducers({
  bank: BankingReducer,
  darkMode: DarkModeReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
