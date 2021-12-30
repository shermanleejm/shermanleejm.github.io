import Dexie from 'dexie';
import { useEffect, useState } from 'react';

const Database = () => {
  const [db, setDb] = useState() as any;

  useEffect(() => {
    const db = new Dexie('mtgdb');
    db.version(1).stores({ cards: '++id,name,price,quantity,date_added' });
    setDb(db);
  }, [db]);

  return <div></div>;
};

export default Database;
