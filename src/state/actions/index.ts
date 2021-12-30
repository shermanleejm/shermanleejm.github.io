import { BankingActionType, DarkModeActionType } from './action-types';

export * as actionTypes from './action-types';

interface DepositAction {
  type: BankingActionType.DEPOSIT;
  payload: number;
}

interface WithdrawAction {
  type: BankingActionType.WITHDRAW;
  payload: number;
}

interface BankruptAction {
  type: BankingActionType.BANKRUPT;
}

export type BankingAction = DepositAction | WithdrawAction | BankruptAction;

export type DarkModeAction =
  | { type: DarkModeActionType.DARK }
  | { type: DarkModeActionType.LIGHT }
  | { type: DarkModeActionType.TOGGLE };
