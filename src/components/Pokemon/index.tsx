import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
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
  TextField,
  Typography,
} from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import InfiniteScroll from '../MTGDB/AddNewCard/InfiniteScroll';
import {
  colorMap,
  getPokemon,
  PokemonTypes,
  SelectedPokemon,
  useGenerations,
  usePokeData,
  useRecommended,
} from './hooks';
import PokeballConfetti from './PokeballConfetti';

export const genAtom = atom('');

export default () => {
  const defaultSelection = {
    '0': { number: -1, name: null, types: [], sprite: null, generation: [] },
    '1': { number: -1, name: null, types: [], sprite: null, generation: [] },
    '2': { number: -1, name: null, types: [], sprite: null, generation: [] },
    '3': { number: -1, name: null, types: [], sprite: null, generation: [] },
    '4': { number: -1, name: null, types: [], sprite: null, generation: [] },
    '5': { number: -1, name: null, types: [], sprite: null, generation: [] },
  };
  const [selection, setSelection] =
    useState<Record<string, SelectedPokemon>>(defaultSelection);
  const [_remainingTypes, setRemainingTypes] = useState<PokemonTypes[]>([]);
  const [_recommendedPokemon, setRecommendedPokemon] = useState<SelectedPokemon[][]>([
    [],
  ]);
  const [_pokeNames, setPokeNames] = useState<string[]>([]);
  const [pokeWindow, setPokeWindow] = useState<SelectedPokemon[]>([]);
  const [pageNum, setPageNum] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const { pokeNames } = usePokeData();
  const { recommendedPokemon, remainingTypes } = useRecommended(selection);
  const generations = useGenerations();
  const [chosenGen, setChosenGen] = useAtom(genAtom);

  useEffect(() => {
    setRemainingTypes(remainingTypes);
    setRecommendedPokemon(recommendedPokemon);
    setPokeNames(pokeNames);
    if (recommendedPokemon.length > 0) {
      setPokeWindow(recommendedPokemon[pageNum]);
    } else {
      setPokeWindow([]);
    }
    setPageNum(0);
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
          {!showBox && <Typography>{name}</Typography>}
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
          {showBox ? (
            <TypeSelector {...{ cardIndex }} />
          ) : (
            <Grid container direction="row" justifyContent="space-around">
              <Button size="small">stats</Button>
              <IconButton target={'_blank'} href={selected.url || ''}>
                <OpenInNew />
              </IconButton>
            </Grid>
          )}
        </CardActions>
      </Card>
    );
  };

  const ResetModal = () => {
    return (
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
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
        </Box>
      </Modal>
    );
  };

  const StatsModal = () => {
    return (
      <Modal open={showStats} onClose={() => setShowStats(false)}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          }}
        >
          stats
        </Box>
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
