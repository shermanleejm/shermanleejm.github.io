import { useEffect, useRef, useState } from 'react';

interface InfiniteScrollProps {
  onBottomHit: () => void;
  isLoading: boolean;
  hasMoreData: boolean;
  children: React.ReactNode;
}

function isBottom(ref: React.RefObject<HTMLDivElement>) {
  if (!ref.current) {
    return false;
  }
  return ref.current.getBoundingClientRect().bottom <= window.innerHeight + 50;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onBottomHit,
  isLoading,
  hasMoreData,
  children,
}) => {
  const [initialLoad, setInitialLoad] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLoad) {
      onBottomHit();
      setInitialLoad(false);
    }
  }, [onBottomHit, initialLoad]);

  useEffect(() => {
    const onScroll = () => {
      if (!isLoading && hasMoreData && isBottom(contentRef)) {
        onBottomHit();
      }
    };
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, [onBottomHit, isLoading, hasMoreData]);

  return <div ref={contentRef}>{children}</div>;
};

export default InfiniteScroll;
