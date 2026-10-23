import {useEffect, useState} from 'react';
import {resumePath} from '../../js/data.js';

export default function useResume() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch(resumePath, {method: 'HEAD', signal: controller.signal})
      .then(response => {
        if (!controller.signal.aborted) setAvailable(response.ok && !!response.headers.get('content-type')?.includes('pdf'));
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeout));
    return () => {controller.abort(); clearTimeout(timeout);};
  }, []);
  return available;
}
