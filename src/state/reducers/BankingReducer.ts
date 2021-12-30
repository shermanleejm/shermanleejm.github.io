import { BankingAction } from '../actions';
import { BankingActionType } from '../actions/action-types';

const BankingReducer = (state: number = 0, action: BankingAction) => {
  switch (action.type) {
    case BankingActionType.BANKRUPT:
      return 0;
    case BankingActionType.DEPOSIT:
      return state + action.payload;
    case BankingActionType.WITHDRAW:
      return state - action.payload;
    default:
      return state;
  }
};

export default BankingReducer;
