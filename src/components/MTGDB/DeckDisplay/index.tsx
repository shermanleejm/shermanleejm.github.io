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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import DeckBuilderUI from './DeckBuilderUI';
import addnewdeck from '../../../assets/addnewdeck.png';
import { getDeckCards, MTGDBProps, ToasterSeverityEnum } from '..';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type DecksType = { [key: string]: CardsTableType[] };

const DeckDisplay = ({ toaster }: MTGDBProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [decks, setDecks] = useState<DecksType>({});
  const [showDecks, setShowDecks] = useState(true);
  const [currDeck, setCurrDeck] = useState<CardsTableType[]>([]);
  const [currDeckName, setCurrDeckName] = useState<string>('');
  const [deckCardState, setDeckCardState] = useState<Set<string>>(new Set());
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [deleteDeckName, setDeleteDeckName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const db = useSelector((state: State) => state.database);

  useEffect(() => {
    async function getDecks() {
      let _decks: DecksType = {};
      let _deckCardState: Set<string> = new Set(
        (await db.decks.toArray()).map((d) => d.name)
      );
      for (let _deckName of _deckCardState) {
        let _deckCards = await getDeckCards(db, _deckName);
        _decks[_deckName] = _deckCards;
      }

      setDeckCardState(_deckCardState);
      setDecks(_decks);
      setIsLoading(false);
    }

    getDecks();
  }, [isLoading]);

  async function deleteDeck(_deckName: string) {
    let deckToDelete = decks[_deckName];
    for (let card of deckToDelete) {
      if (card.id !== undefined) {
        toaster(`Removing ${card.name} from ${_deckName}`, ToasterSeverityEnum.INFO);
        await db.cards.update(card.id, {
          tags: card.tags.filter((t) => t !== _deckName),
        });
      }
    }
    setIsLoading(true);
    setDeleteDialogState(false);
    setIsDeleting(false);
  }

  return isLoading ? (
    <CircularProgress />
  ) : (
    <DndProvider backend={HTML5Backend}>
      <div>
        {showDecks ? (
          <Grid container spacing={3} alignItems={'center'}>
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
                  <CardMedia
                    component="img"
                    src={decks[deckName][0].image_uri.normal[0]}
                  />
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
                    <Button
                      disabled={!deckCardState.has(deckName)}
                      onClick={() => {
                        setDeleteDeckName(deckName);
                        setDeleteDialogState(true);
                      }}
                    >
                      delete
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

        {/* Delete Dialog */}
        <Dialog onClose={() => setDeleteDialogState(false)} open={deleteDialogState}>
          <DialogTitle>Confirm delete?</DialogTitle>
          <DialogContent>{isDeleting && <CircularProgress />}</DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsDeleting(true);
                setDeckCardState((prev) => {
                  let tmp = prev;
                  tmp.delete(deleteDeckName);
                  return tmp;
                });
                deleteDeck(deleteDeckName);
              }}
            >
              Confirm
            </Button>
            <Button onClick={() => setDeleteDialogState(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default DeckDisplay;
