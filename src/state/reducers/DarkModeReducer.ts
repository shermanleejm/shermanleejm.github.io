import { DarkModeAction } from '../actions';
import { DarkModeActionType } from '../actions/action-types';

const darkModeDefault = true;

const DarkModeReducer = (state: boolean = darkModeDefault, action: DarkModeAction) => {
  switch (action.type) {
    case DarkModeActionType.LIGHT:
      return false;
    case DarkModeActionType.DARK:
      return true;
    case DarkModeActionType.TOGGLE:
      return !state;
    default:
      return state;
  }
};

export default DarkModeReducer;
