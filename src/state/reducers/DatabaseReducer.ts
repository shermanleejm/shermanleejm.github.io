import Dexie from 'dexie';
import { DatabaseAction } from '../actions';
import { DatabaseActionType } from '../actions/action-types';

const databaseDefault = new Dexie('mtgdb');
databaseDefault.version(1).stores({ cards: '++id,name,price,quantity,date_added' });

const DatabaseReducer = (state = databaseDefault, action: DatabaseAction) => {
  switch (action.type) {
    case DatabaseActionType.GET:
      return state;
    default:
      return state;
  }
};

export default DatabaseReducer;
