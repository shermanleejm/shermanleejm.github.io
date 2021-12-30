import { Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createWorker } from 'tesseract.js';

const MTGDB = () => {
  const [img, setImg] = useState('');
  const [text, setText] = useState('');
  const [worker, setWorker] = useState() as any;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let worker = createWorker({
      logger: (m) => console.log(m),
    });
    setWorker(worker);
    setIsLoading(false);
  }, [isLoading]);

  const handleClick = async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const {
      data: { text },
    } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
    setText(text);
  };

  const handleChange = (event: any) => {
    setImg(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <Typography>
      {img}
      {text}
      <input type="file" accept="image/*" capture="environment" onChange={handleChange} />
      <Button onClick={handleClick}>do magic</Button>
    </Typography>
  );
};

export default MTGDB;
