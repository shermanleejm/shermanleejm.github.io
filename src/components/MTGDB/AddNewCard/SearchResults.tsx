import { CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { ToasterSeverityEnum } from '..';
import { ScryfallDataType } from '../interfaces';
import InfiniteScroll from './InfiniteScroll';
import SearchResultCard from './SearchResultCard';

type SearchResultsComponentProps = {
  searchResults: ScryfallDataType[];
  defaultTag: string;
  toaster: (m: string, e: ToasterSeverityEnum) => void;
};

const SearchResults = ({
  searchResults,
  defaultTag,
  toaster,
}: SearchResultsComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [infiniteData, setInfiniteData] = useState<ScryfallDataType[]>([]);
  const [_searchResults, set_searchResults] = useState<ScryfallDataType[]>([]);
  const PER_PAGE = 12;
  const [endPage, setEndPage] = useState(PER_PAGE);
  const [showBottomSpinner, setShowBottomSpinner] = useState(false);

  useEffect(() => {
    function init() {
      setInfiniteData(searchResults.slice(0, PER_PAGE));
      set_searchResults(searchResults);
      setIsLoading(false);
    }

    init();
  }, [searchResults]);

  const loadMoreCards = () => {
    setShowBottomSpinner(true);

    setTimeout(() => {
      let newEndPage = endPage + PER_PAGE;
      setInfiniteData(searchResults.slice(0, newEndPage));
      setEndPage(newEndPage);
      setShowBottomSpinner(false);
    }, 100);
  };

  const BottomSpinner = () => {
    return infiniteData.length === searchResults.length ? (
      <Grid item>
        <Typography>You reached the bottom!</Typography>
      </Grid>
    ) : (
      <CircularProgress />
    );
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <>
      {/* Search results */}
      <Grid item>
        <InfiniteScroll
          hasMoreData={infiniteData.length < _searchResults.length}
          isLoading={showBottomSpinner}
          onBottomHit={loadMoreCards}
        >
          <Grid
            container
            direction="row"
            spacing={1}
            justifyContent={'start'}
            alignItems={'stretch'}
            style={{ width: '80vw' }}
          >
            {infiniteData.map((sr: ScryfallDataType, i) => (
              <Grid item xs={6} md={4} lg={3} key={i}>
                <SearchResultCard sr={sr} defaultTag={defaultTag} toaster={toaster} />
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Grid>
      {_searchResults.length > 0 && <BottomSpinner />}
    </>
  );
};

export default SearchResults;
