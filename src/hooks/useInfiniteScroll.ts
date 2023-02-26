import { useState, useEffect, useRef } from "react";

const useInfiniteScroll = (
  callback: () => Promise<void>,
  initialLoading: boolean = false
) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        scrollRef.current &&
        scrollRef.current.getBoundingClientRect().bottom <= window.innerHeight
      ) {
        setLoading(true);
        await callback();
        setLoading(false);
      }
    };

    const scrollElement = scrollRef.current;

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [callback]);

  return { scrollRef, loading };
};

export default useInfiniteScroll;
