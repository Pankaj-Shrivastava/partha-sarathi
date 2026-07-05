export const fetchWelcome = async () => {
  try {
    const response = await fetch('/api/welcome');
    if (!response.ok) {
      throw new Error('Failed to fetch welcome shloka');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching welcome:', error);
    return null; // Return null so the UI can fallback gracefully
  }
};

export const sendChatMessage = async (message, sessionId, isFollowUp) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId, isFollowUp }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
