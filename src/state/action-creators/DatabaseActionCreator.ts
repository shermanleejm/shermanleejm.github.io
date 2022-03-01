import { Dispatch } from 'redux';
import { DatabaseAction } from '../actions';
import { DatabaseActionType } from '../actions/action-types';

export const getDatabase = () => {
  return (dispatch: Dispatch<DatabaseAction>) => {
    dispatch({
      type: DatabaseActionType.CARDS,
    });
  };
};
