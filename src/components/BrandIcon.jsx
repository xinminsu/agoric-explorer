import Box from '@mui/material/Box';
import { icons } from '../util/Icons';
import defaultIcon from '../tokens/generic.ico';
import type { Petname } from '@agoric/smart-wallet/src/types';

interface Props {
  brandPetname: Petname;
}

const BrandIcon = ({ brandPetname }: Props) => {
  const src =
    (typeof brandPetname === 'string' && icons[brandPetname]) || defaultIcon;

  const icon = src ? (
    <img alt="icon" src={src} height="32px" width="32px" />
  ) : (
    <Box sx={{ height: 32, width: 32 }}></Box>
  );

  return <Box sx={{ mr: 2 }}>{icon}</Box>;
};

export default BrandIcon;
