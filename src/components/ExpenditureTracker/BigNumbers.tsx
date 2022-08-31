import { ChangeEvent, useState, useEffect } from "react";
import { Grid, IconButton, TextField } from "@mui/material";
import { KeyItem, KeyItemTitle } from "./KeyItem";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";

const BigNumbers = () => {
  const db = useSelector((state: State) => state.database);
  const [showEditPayday, setShowEditPayday] = useState(false);
  const [payday, setPayday] = useState(25);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(1, "months").date(payday).unix(),
    endDate: dayjs().unix(),
  });

  useEffect(() => {
    function getPayday() {
      let payday = Number(window.localStorage.getItem("payday") || "15");
      setPayday(payday);
    }
    function monitorLocalStorage() {
      window.addEventListener("storage", () => {
        getPayday();
      });
    }
    getPayday();
    monitorLocalStorage();
  }, [payday]);

  const data = useLiveQuery(async () => {
    let currentMonth = (await db.expenditure.toArray())
      .filter(
        (ex) =>
          ex.datetime >= dateRange.startDate && ex.datetime <= dateRange.endDate
      )
      .reduce(
        (total, { amount, is_credit }) =>
          total + (is_credit ? Number(amount) : Number(amount) * -1),
        0
      );

    let total = (await db.expenditure.toArray()).reduce(
      (total, { amount, is_credit }) =>
        total + (is_credit ? Number(amount) : Number(amount) * -1),
      0
    );

    let saving = (await db.expenditure.toArray())
      .filter((x) => x.datetime >= dayjs().date(payday).unix())
      .reduce(
        (total, { amount, is_credit }) =>
          total + (is_credit ? Number(amount) : Number(amount) * -1),
        0
      );

    let spending = (await db.expenditure.toArray())
      .filter((x) => !x.is_credit && x.datetime >= dayjs().date(payday).unix())
      .map((item) => item.amount)
      .reduce((prev, next) => Number(prev) + Number(next), 0);

    return {
      currentMonth: currentMonth,
      total: total,
      spending: spending,
      saving: saving,
    };
  }, [dateRange]);

  return (
    <div>
      <Grid
        container
        justifyContent={"center"}
        alignItems={"center"}
        direction={"row"}
        style={{ textAlign: "center" }}
      >
        <Grid item xs={6} md={3}>
          <KeyItem
            value={`$${data?.currentMonth.toLocaleString()}`}
            title={"Available funds"}
            color={
              Number(data?.currentMonth.toLocaleString()) < 0 ? "red" : "green"
            }
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <div>
            {showEditPayday ? (
              <>
                <KeyItemTitle title="Pay day" />
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <TextField
                    size="small"
                    sx={{ width: 50 }}
                    value={payday}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPayday(
                        Math.min(Number(e.target.value.replace(/\D/g, "")), 31)
                      )
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      setShowEditPayday(false);
                      window.localStorage.setItem("payday", payday.toString());
                    }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </div>
              </>
            ) : (
              <div onClick={() => setShowEditPayday(true)}>
                <KeyItem
                  value={String(payday)}
                  title={"Pay day"}
                  color="orange"
                />
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Monthly Save"
            value={`$${data?.saving.toLocaleString()}` || "$0"}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <KeyItem
            title="Monthly Spend"
            value={`$${data?.spending.toLocaleString()}` || "$0"}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default BigNumbers;
