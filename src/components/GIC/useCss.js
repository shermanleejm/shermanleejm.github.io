import { useEffect } from 'react';

const useCss = (url) => {
  useEffect(() => {
    const stylesheet = document.createElement('lihk');

    stylesheet.rel = 'stylesheet';
    stylesheet.href = url;

    document.body.appendChild(stylesheet);

    return () => {
      document.body.removeChild(stylesheet);
    };
  }, [url]);
};

export default useCss;
