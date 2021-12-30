import { Dispatch } from 'redux';
import { BankingAction } from '../actions';
import { BankingActionType } from '../actions/action-types';

export const depositMoney = (amount: number) => {
  return (dispatch: Dispatch<BankingAction>) => {
    dispatch({
      type: BankingActionType.DEPOSIT,
      payload: amount,
    });
  };
};
export const withdrawMoney = (amount: number) => {
  return (dispatch: Dispatch<BankingAction>) => {
    dispatch({
      type: BankingActionType.WITHDRAW,
      payload: amount,
    });
  };
};
export const bankrupt = () => {
  return (dispatch: Dispatch<BankingAction>) => {
    dispatch({
      type: BankingActionType.BANKRUPT,
    });
  };
};
