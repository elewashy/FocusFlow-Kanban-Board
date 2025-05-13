import { getAuthToken } from './auth';
import { API_BASE_URL } from '@/config';

export async function generateAIResponse(input: string, context: string) {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        input,
        context
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      console.error('API Error:', error);
      throw new Error(error.details || error.error || 'API request failed');
    }

    const data = await response.json();
    return data.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}
