import BoringTracker from './BoringTracker';
import CryptoTracker from './CryptoTracker';
import Countdown from './Countdown';

const AssetTracker = () => {
  return (
    <div style={{ margin: '0 0% 0 0%' }}>
      <CryptoTracker />
      <Countdown />
      <BoringTracker />
    </div>
  );
};

export default AssetTracker;
