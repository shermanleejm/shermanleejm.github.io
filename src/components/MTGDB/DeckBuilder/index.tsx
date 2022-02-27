import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../../state/reducers';
import { CardsTableType } from '../../../database';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import DeckBuilderUI from './DeckBuilderUI';
import addnewdeck from '../../../assets/addnewdeck.png';

type DecksType = { [key: string]: CardsTableType[] };

const DeckDisplay = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [decks, setDecks] = useState<DecksType>({});
  const [showDecks, setShowDecks] = useState(true);
  const [currDeck, setCurrDeck] = useState<CardsTableType[]>([]);
  const [currDeckName, setCurrDeckName] = useState<string>('');

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function getDecks() {
      let _decks: DecksType = {};
      let arr = await db.cards.toArray();
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].tags.length; j++) {
          let t = arr[i].tags[j];
          if (!(t in _decks)) {
            _decks[t] = [];
          }
          _decks[t].push(arr[i]);
        }
      }
      setDecks(_decks);
      setIsLoading(false);
    }

    getDecks();
  }, [isLoading]);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div>
      {showDecks ? (
        <Grid container spacing={3} alignItems={'center'} justifyContent={'center'}>
          <Grid item xs={4} sm={3}>
            <Card>
              <CardMedia component="img" image={addnewdeck} />
              <CardContent>
                <TextField
                  label="New Deck Name"
                  value={currDeckName}
                  onChange={(e: any) => setCurrDeckName(e.target.value)}
                />
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => {
                    setCurrDeck([]);
                    setShowDecks(false);
                  }}
                >
                  add
                </Button>
              </CardActions>
            </Card>
          </Grid>
          {Object.keys(decks).map((deckName) => (
            <Grid item xs={4} sm={3}>
              <Card>
                <CardMedia component="img" src={decks[deckName][0].image_uri.normal[0]} />
                <CardContent>
                  <Typography variant="body1">{deckName}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    onClick={() => {
                      setCurrDeckName(deckName);
                      setCurrDeck(decks[deckName]);
                      setShowDecks(false);
                    }}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Button
          fullWidth
          onClick={() => {
            setShowDecks(true);
            setIsLoading(true);
          }}
        >
          Show decks
        </Button>
      )}

      {!showDecks && <DeckBuilderUI currDeck={currDeck} deckName={currDeckName} />}
    </div>
  );
};

export default DeckDisplay;
