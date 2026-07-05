import { useState, useEffect } from 'react';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useSession() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    try {
      let currentSession = sessionStorage.getItem('partha_sarathi_session');
      if (!currentSession) {
        currentSession = generateUUID();
        sessionStorage.setItem('partha_sarathi_session', currentSession);
      }
      setSessionId(currentSession);
    } catch (e) {
      // Fallback for strict incognito where sessionStorage is blocked
      console.warn('sessionStorage is not available. Using ephemeral session.');
      setSessionId(generateUUID());
    }
  }, []);

  return sessionId;
}
