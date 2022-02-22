import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { State } from "../../../state/reducers";
import { CardsTableType } from "../../../database";

const DeckDisplay = () => {
  const [decks, setDecks] = useState<CardsTableType[][]>([]);

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function getDecks() {
      let decks = new Set<string>();
      let arr = await db.cards.toArray();
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].tags.length; j++) {
          decks.add(arr[i].tags[j]);
        }
      }
      console.log(decks);
    }

    getDecks();
  }, []);
  return <div></div>;
};

export default DeckDisplay;
