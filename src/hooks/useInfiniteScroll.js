import { useEffect, useRef, useCallback } from 'react';

function useInfiniteScroll(callback, hasMore, isLoading) {
  const observerRef = useRef(null);
  
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    
    if (target.isIntersecting && hasMore && !isLoading) {
      callback();
    }
  }, [callback, hasMore, isLoading]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleObserver]);

  return observerRef;
}

export default useInfiniteScroll;

