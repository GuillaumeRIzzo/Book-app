// src/hooks/useHeaderHeight.ts
import { useEffect, useState } from 'react';

export const useHeaderHeight = (id = 'app-header') => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const header = document.getElementById(id);
    if (!header) return;

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });

    observer.observe(header);

    return () => observer.disconnect();
  }, [id]);

  return height;
}
