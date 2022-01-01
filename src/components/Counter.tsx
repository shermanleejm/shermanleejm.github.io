// just for my reference not being used
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BankActionCreators } from '../state/action-creators';
import { State } from '../state/reducers';

const Counter = () => {
  const { withdrawMoney, depositMoney, bankrupt } = bindActionCreators(
    BankActionCreators,
    useDispatch()
  );

  const amount = useSelector((state: State) => state.bank);
  return (
    <div>
      {amount}
      <button onClick={() => depositMoney(1000)}>add money</button>
      <button onClick={() => withdrawMoney(1000)}>minus money</button>
      <button onClick={() => bankrupt()}>null money</button>
    </div>
  );
};

export default Counter;
