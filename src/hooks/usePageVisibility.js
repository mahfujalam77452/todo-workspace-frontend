'use client';

import { useEffect, useState } from 'react';

// true while the browser tab is visible.
export default function usePageVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function update() {
      setVisible(document.visibilityState !== 'hidden');
    }
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return visible;
}