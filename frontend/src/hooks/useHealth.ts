import { useState, useEffect } from 'react';
import { getHealthStatus } from '../services/dashboardService';

export function useHealth(pollIntervalMs = 15000) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkHealth() {
      try {
        const res = await getHealthStatus();
        if (isMounted) setIsHealthy(res.status === 'healthy');
      } catch {
        if (isMounted) setIsHealthy(false);
      }
    }

    checkHealth();
    const timer = setInterval(checkHealth, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [pollIntervalMs]);

  return { isHealthy };
}
