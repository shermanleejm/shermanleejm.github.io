import { Typography } from '@mui/material';

interface KeyItemsProps {
  title: string;
  value: string;
  color?: string;
}

interface KeyItemTitleProps {
  title: string;
}

export const KeyItemTitle = ({ title }: KeyItemTitleProps) => {
  return <Typography variant="body1">{title}</Typography>;
};

export const KeyItem = ({ title, value, color }: KeyItemsProps) => {
  return (
    <div>
      <KeyItemTitle title={title} />
      <Typography variant="h6" style={{ color: color }}>
        {value}
      </Typography>
    </div>
  );
};
