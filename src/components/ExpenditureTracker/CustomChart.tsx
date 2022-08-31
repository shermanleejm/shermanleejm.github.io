import { useLiveQuery } from "dexie-react-hooks";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";

const CustomChart = () => {
  const db = useSelector((state: State) => state.database);
  const data = useLiveQuery(async () => {
    let _data = await db.expenditure.toArray();
    let cleanData = [...new Set(_data.map((item) => item.category))].map(
      (val) => ({
        name: val,
        children: _data
          .filter((item) => !item.is_credit && item.category === val)
          .map((item) => {
            return {
              name: item.name,
              amount: item.amount,
            };
          })
          .reduce((a: any[], c) => {
            let existing: any = a.find((n: any) => n.name === c.name);
            if (existing) {
              existing.amount += c.amount;
            } else {
              a.push(c);
            }
            return a;
          }, []),
      })
    );

    return db.expenditure.toArray();
  });

  return <div></div>;
};

export default CustomChart;
