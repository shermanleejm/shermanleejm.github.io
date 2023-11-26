import { Numbers, OpenInNew, Restaurant } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect, useState } from 'react';
import InfiniteScroll from '../MTGDB/AddNewCard/InfiniteScroll';
import {
  colorMap,
  getPokemon,
  PokemonTypes,
  SelectedPokemon,
  SelectedPokemonStats,
  useGenerations,
  usePokeData,
  useRecommended,
} from './hooks';
import PokeballConfetti from './PokeballConfetti';

const defaultStats = {
  Total: '0',
  HP: '0',
  Attack: '0',
  Defense: '0',
  'Sp. Atk': '0',
  'Sp. Def': '0',
  Speed: '0',
} as SelectedPokemonStats;
const defaultSelectedPokemon = {
  name: null,
  types: [],
  sprite: null,
  generation: [],
  total_stats: defaultStats,
} as SelectedPokemon;
const defaultSelection = {
  '0': defaultSelectedPokemon,
  '1': defaultSelectedPokemon,
  '2': defaultSelectedPokemon,
  '3': defaultSelectedPokemon,
  '4': defaultSelectedPokemon,
  '5': defaultSelectedPokemon,
} as Record<string, SelectedPokemon>;

export const genAtom = atom('');
const selectionAtom = atomWithStorage('selection', defaultSelection);

export default () => {
  const [selection, setSelection] = useAtom(selectionAtom);
  const [_remainingTypes, setRemainingTypes] = useState<PokemonTypes[]>([]);
  const [_recommendedPokemon, setRecommendedPokemon] = useState<SelectedPokemon[][]>([
    [],
  ]);
  const [_pokeNames, setPokeNames] = useState<string[]>([]);
  const [pokeWindow, setPokeWindow] = useState<SelectedPokemon[]>([]);
  const [pageNum, setPageNum] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState({
    show: false,
    stats: defaultStats,
  });
  const [showSTAB, setShowSTAB] = useState(false);

  const { pokeNames } = usePokeData();
  const { recommendedPokemon, remainingTypes } = useRecommended(selection);
  const generations = useGenerations();
  const [chosenGen, setChosenGen] = useAtom(genAtom);

  useEffect(() => {
    setPageNum(0);
    setRemainingTypes(remainingTypes);
    setRecommendedPokemon(recommendedPokemon);
    setPokeNames(pokeNames);
    if (recommendedPokemon.length > 0) {
      setPokeWindow(recommendedPokemon[0]);
    } else {
      setPokeWindow([]);
    }
  }, [selection, chosenGen]);

  const loadMore = () => {
    let newPageNum = pageNum + 1;
    let newPage = _recommendedPokemon[newPageNum] || [];
    setPokeWindow([...pokeWindow, ...newPage]);
    setPageNum(newPageNum);
  };

  const TypeSelector = ({ cardIndex }: { cardIndex: string }) => {
    return (
      <Grid container direction="column" gap={2}>
        <Grid item>
          <Autocomplete
            options={_pokeNames}
            value={selection[cardIndex].name}
            onChange={(event: any, newValue: string | null) =>
              setSelection({
                ...selection,
                [cardIndex]: getPokemon(newValue),
              })
            }
            renderInput={(params) => <TextField {...params} label="Names" size="small" />}
          />
        </Grid>
      </Grid>
    );
  };

  const PokeCard = ({
    cardIndex = '-1',
    showBox = true,
    poke = defaultSelection['0'],
  }: {
    cardIndex?: string;
    showBox?: boolean;
    poke?: SelectedPokemon;
  }) => {
    let selected = showBox ? selection[cardIndex] : poke;
    let sprite: string = selected.sprite || '';
    let types: PokemonTypes[] = selected.types;
    let name: string = selected.name || '';

    return (
      <Card>
        <CardMedia component="img" src={sprite} alt={name} />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography>{!showBox && name}</Typography>
          <Typography fontSize={13} variant={'subtitle1'}>
            {types.map((t, i) => (
              <span key={i}>
                {i === 1 ? ' · ' : ''}
                <span style={{ color: colorMap[t] }}>{t}</span>
              </span>
            ))}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container justifyContent={'space-around'}>
            <Grid item xs={12}>
              {showBox ? <TypeSelector {...{ cardIndex }} /> : <></>}
            </Grid>

            {(cardIndex === '-1' || selection[cardIndex].name !== null) && (
              <>
                <Grid item xs={3}>
                  <IconButton size="small">
                    <Restaurant />
                  </IconButton>
                </Grid>

                <Grid item xs={3}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setShowStats({
                        stats: selected.total_stats || defaultStats,
                        show: true,
                      })
                    }
                  >
                    <Numbers />
                  </IconButton>
                </Grid>

                <Grid item xs={3}>
                  <IconButton size="small" href={selected.url || ''} target="_blank">
                    <OpenInNew />
                  </IconButton>
                </Grid>
              </>
            )}
          </Grid>
        </CardActions>
      </Card>
    );
  };

  const DefaultModalBox: React.FC = ({ children }) => {
    return (
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
        }}
      >
        {children}
      </Box>
    );
  };

  const ResetModal = () => {
    return (
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <DefaultModalBox>
          <Typography>Confirm reset?</Typography>
          <Button
            onClick={() => {
              setSelection(defaultSelection);
              setShowModal(false);
            }}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setRemainingTypes([]);
              setShowModal(false);
              setTimeout(() => {
                setSelection(defaultSelection);
              }, 5000);
            }}
          >
            Yes but louder
          </Button>
        </DefaultModalBox>
      </Modal>
    );
  };

  const StatsModal = () => {
    return (
      <Modal
        open={showStats.show}
        onClose={() => setShowStats({ ...showStats, show: false })}
      >
        <DefaultModalBox>
          <TableContainer component={Paper} sx={{ minWidth: '100%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(showStats.stats).map((k, index) => (
                    <TableCell key={index}>{k}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {Object.values(showStats.stats).map((v, index) => (
                    <TableCell key={index}>{v}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DefaultModalBox>
      </Modal>
    );
  };

  const STABModal = () => {
    return (
      <Modal open={showSTAB} onClose={() => setShowSTAB(false)}>
        <DefaultModalBox></DefaultModalBox>
      </Modal>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Autocomplete
                value={chosenGen}
                onChange={(e: any, newValue: string | null) =>
                  setChosenGen(newValue || '')
                }
                options={generations}
                renderInput={(props) => <TextField {...props} label="Generation" />}
              />
            </CardContent>
          </Card>
        </Grid>
        {Object.keys(defaultSelection).map((i) => (
          <Grid item xs={4} key={i}>
            <PokeCard cardIndex={i} />
          </Grid>
        ))}
      </Grid>

      <Grid container direction="row" justifyContent="center" alignItems="center">
        {_remainingTypes.map((rt, i) => (
          <Grid item xs={2} sx={{ textAlign: 'center' }} key={i}>
            <Typography sx={{ color: colorMap[rt] }}>{rt}</Typography>
          </Grid>
        ))}
      </Grid>

      <Button fullWidth onClick={() => setShowModal(true)}>
        reset
      </Button>

      {_remainingTypes.length !== 0 && _recommendedPokemon.length > 0 && (
        <InfiniteScroll
          hasMoreData={pageNum < _recommendedPokemon.length}
          isLoading={false}
          onBottomHit={loadMore}
        >
          <Grid container>
            {pokeWindow.map((poke, i) => (
              <Grid item xs={4} sm={3} md={2} lg={1} key={i}>
                <PokeCard {...{ poke }} showBox={false} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      )}

      {_remainingTypes.length === 0 && (
        <>
          <PokeballConfetti />
        </>
      )}

      <ResetModal />

      <StatsModal />
    </div>
  );
};