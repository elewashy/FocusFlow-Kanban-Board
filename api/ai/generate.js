// API endpoint for AI response generation
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with server-side keys
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify authentication
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  // Verify the token with Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    const { input, context } = req.body;

    if (!input) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "X-Title": "FocusFlow AI Assistant",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: `You are a helpful project management assistant. Keep your responses concise and focused:

1. Start with a simple "Hello" or "Hi"

2. When showing task statistics, use this format:
- Completed: [number]
- To do: [number]
- In Progress: [number]
- High priority: [number]

3. Keep suggestions brief and relevant to the question
- Use bullet points for clarity
- No more than 3 suggestions
- Focus on actionable steps

4. Use bold for important numbers or key points
- Example: "You have **2** high priority tasks"
- Example: "Focus on **completing the current task** first"

Keep responses direct and helpful, avoiding unnecessary decoration or lengthy explanations.`
          },
          {
            role: "user",
            content: `Context: ${context || ''}\n\nUser question: ${input}`
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      console.error('OpenRouter API Error:', {
        status: response.status,
        statusText: response.statusText,
        error
      });
      return res.status(400).json({ 
        error: 'Failed to generate AI response',
        details: error.error || error.message || response.statusText
      });
    }

    const data = await response.json();
    return res.status(200).json({
      content: data.choices[0]?.message?.content || "I couldn't generate a response. Please try again."
    });
  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error.message || 'Failed to generate AI response';
    console.error('AI Generation Error:', {
      message: errorMessage,
      error
    });
    return res.status(500).json({ 
      error: 'Failed to generate AI response',
      details: errorMessage
    });
  }
}
