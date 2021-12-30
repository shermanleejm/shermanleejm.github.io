import { Dispatch } from 'redux';
import { DarkModeAction } from '../actions';
import { DarkModeActionType } from '../actions/action-types';

export const lightMode = () => {
  return (dispatch: Dispatch<DarkModeAction>) => {
    dispatch({
      type: DarkModeActionType.LIGHT,
    });
  };
};

export const darkMode = () => {
  return (dispatch: Dispatch<DarkModeAction>) => {
    dispatch({
      type: DarkModeActionType.DARK,
    });
  };
};

export const toggleDarkMode = () => {
  return (dispatch: Dispatch<DarkModeAction>) => {
    dispatch({
      type: DarkModeActionType.TOGGLE,
    });
  };
};
