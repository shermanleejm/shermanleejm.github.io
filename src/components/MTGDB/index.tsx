import { useEffect, useState } from "react";
import AddNewCard from "./AddNewCard";
import Display from "./Display";

const MTGDB = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {}, [isLoading]);

  return (
    <div>
      <AddNewCard refresh={(e: boolean) => setIsLoading(e)} />

      <Display />
    </div>
  );
};

export default MTGDB;
