import Brightness7Icon from '@mui/icons-material/Brightness7';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import ParkIcon from '@mui/icons-material/Park';
import { TextField } from '@mui/material';
import { MTGDBProps } from '..';

const DeckBuilder = () => {
  return (
    <div>
      <TextField label="general search"></TextField>
      <Brightness7Icon />
      <SentimentNeutralIcon />
      <WhatshotIcon />
      <InvertColorsIcon />
      <ParkIcon />
    </div>
  );
};

export default DeckBuilder;
