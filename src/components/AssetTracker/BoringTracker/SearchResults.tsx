import Check from '@mui/icons-material/Check';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

type Props = {
  searchResults: any[];
  setShowForm: (_: boolean) => void;
  setShowSearchResults: (_: boolean) => void;
  setFormStuff: (_: {
    symbol: string;
    name: string;
    type: string;
    region: string;
  }) => void;
};

export default ({
  searchResults,
  setShowForm,
  setFormStuff,
  setShowSearchResults,
}: Props) => (
  <TableContainer style={{ margin: '0 0 3% 0' }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Symbol</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Region</TableCell>
          <TableCell>Correct?</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {searchResults.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row['1. symbol']}</TableCell>
              <TableCell>{row['2. name']}</TableCell>
              <TableCell>{row['3. type']}</TableCell>
              <TableCell>{row['4. region']}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    setFormStuff({
                      symbol: row['1. symbol'],
                      name: row['2. name'],
                      type: row['3. type'],
                      region: row['4. region'],
                    });
                    setShowForm(true);
                    setShowSearchResults(false);
                  }}
                >
                  <Check />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);
