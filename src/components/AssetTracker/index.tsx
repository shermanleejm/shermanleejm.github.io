import BoringTracker from './BoringTracker';
import CryptoTracker from './CryptoTracker';
import Countdown from './Countdown';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { changeManifest } from '..';

export default () => {
  const location = useLocation();

  useEffect(() => {
    changeManifest(location);
  }, [location]);

  return (
    <div style={{ margin: '0 0% 0 0%' }}>
      <Countdown />
      <BoringTracker />
      <CryptoTracker />
    </div>
  );
};
