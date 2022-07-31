import BoringTracker from './BoringTracker';
import CryptoTracker from './CryptoTracker';
import Countdown from './Countdown';
import { useEffect } from 'react';

const AssetTracker = () => {
  useEffect(() => {
    function changeManifest() {
      let manifest = {
        short_name: 'STONKS GO MOON',
        name: 'Asset Tracker',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '/expenditure_tracker',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#ffffff',
      };

      const stringManifest = JSON.stringify(manifest);
      const blob = new Blob([stringManifest], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(blob);
      document.querySelector('#manifest')?.setAttribute('href', manifestURL);
    }

    changeManifest();
  }, []);

  return (
    <div style={{ margin: '0 0% 0 0%' }}>
      <CryptoTracker />
      <Countdown />
      <BoringTracker />
    </div>
  );
};

export default AssetTracker;
