import { MTGDatabase } from '../../database';
import { DatabaseAction } from '../actions';
import { DatabaseActionType } from '../actions/action-types';

const databaseDefault = new MTGDatabase();

const DatabaseReducer = (state = databaseDefault, action: DatabaseAction) => {
  switch (action.type) {
    case DatabaseActionType.GET:
      return state;
    default:
      return state;
  }
};

export default DatabaseReducer;
