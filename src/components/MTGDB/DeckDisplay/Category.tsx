import { Typography } from '@mui/material';
import { ReactFragment } from 'react';
type CategoryType = {
  children?: ReactFragment;
  title: string;
};

export const Category = ({ children, title }: CategoryType) => {
  return (
    <div>
      <Typography variant="h5">{title}</Typography>
      {children}
    </div>
  );
};
export default Category;
