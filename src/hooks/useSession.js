import { useState, useEffect } from 'react';
import { fetchWelcome } from '../utils/api';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useSession() {
  const [sessionId, setSessionId] = useState(null);
  const [welcomeShloka, setWelcomeShloka] = useState(null);

  useEffect(() => {
    // 1. Initialize or retrieve session ID
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

    // 2. Fetch welcome shloka when the app loads
    const loadWelcome = async () => {
      const data = await fetchWelcome();
      if (data) {
        setWelcomeShloka(data);
      } else {
        // Fallback to default if backend fails
        setWelcomeShloka({
          shloka: {
            devanagari: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
            citation: "Chapter 2, Verse 47"
          },
          translation: "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty."
        });
      }
    };

    loadWelcome();
  }, []);

  return { sessionId, welcomeShloka };
}
