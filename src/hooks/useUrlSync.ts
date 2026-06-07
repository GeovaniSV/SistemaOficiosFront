import { useState, useCallback } from 'react';

export function useUrlSync(basePath: string) {
  const [urlParam, setUrlParam] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith(basePath)) {
      return decodeURIComponent(path.replace(basePath, ''));
    }
    return null;
  });

  const updateUrl = useCallback((param: string | null) => {
    setUrlParam(param);
    if (param) {
      window.history.pushState({}, '', `${basePath}${encodeURIComponent(param)}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  }, [basePath]);

  return [urlParam, updateUrl] as const;
}
