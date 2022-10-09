import styled from '@emotion/styled';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function Toolbar() {
  useEffect(() => {
    const totalMonths = '';
  });

  const CustomBar = styled.div({
    background: 'rgba(220, 220, 220, 0.5)',
    height: 'auto',
    padding: 10,
    width: '100vw',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  return (
    <CustomBar>
      <IconButton>
        <ArrowBack />
      </IconButton>
      <Typography>Current month</Typography>
      <IconButton>
        <ArrowForward />
      </IconButton>
    </CustomBar>
  );
}
