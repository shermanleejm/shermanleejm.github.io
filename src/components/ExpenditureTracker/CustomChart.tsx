import { useLiveQuery } from "dexie-react-hooks";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { BasicTooltip } from "@nivo/tooltip";
import { useState } from "react";
import { CircularProgress } from "@mui/material";

interface Inner {
  name: string;
  amount: number;
}

const CustomChart = () => {
  const db = useSelector((state: State) => state.database);
  const darkMode = useSelector((state: State) => state.darkMode);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useLiveQuery(async () => {
    let _data = await db.expenditure.toArray();
    let res = [
      ...new Set(
        _data.filter((item) => !item.is_credit).map((item) => item.category)
      ),
    ].map((val) => ({
      name: val,
      children: _data
        .filter((item) => item.category === val)
        .map((item) => {
          return {
            name: item.name,
            amount: item.amount,
          };
        })
        .reduce((a: any[], c) => {
          let existing: Inner | undefined = a.find(
            (n: Inner) => n.name?.toLowerCase() === c.name.toLowerCase()
          );
          if (existing) {
            existing.amount += Number(c.amount);
          } else {
            a.push(c);
          }
          return a;
        }, []),
    }));
    setData({ name: "total", children: res });
    setIsLoading(false);
  });

  // const totalAmount = useLiveQuery(async)

  return isLoading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <div
      style={{
        height: "300px",
        width: "300px",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <ResponsiveSunburst
        data={data}
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        id="name"
        value="amount"
        cornerRadius={2}
        borderColor={{ theme: "background" }}
        colors={{ scheme: "nivo" }}
        // childColor={{
        //   from: "color",
        //   modifiers: [["brighter", 0.1]],
        // }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabel={(e) => `${e.id} ${e.value}`}
        arcLabelsTextColor={darkMode ? "#fff" : "#000"}
        // tooltip={(e) => (
        //   <div style={{background: 'red'}}>
        //     <BasicTooltip id={e.id} value={e.value} color={"#f50a16"} />
        //   </div>
        // )}
      />
    </div>
  );
};

export default CustomChart;
