import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // Return user data and token
    return res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
      },
      token: data.session.access_token
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Sign up with Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'Registration successful. Please check your email for confirmation.'
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    // Sign out with Supabase
    await supabase.auth.signOut({ token });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/session', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Return user data
    return res.status(200).json({
      session: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        }
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Tasks endpoints
app.get('/api/tasks', async (req, res) => {
  try {
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

    const userId = user.id;

    // Fetch tasks for the user
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert database rows to Task type
    const tasks = data.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      assignedTo: row.assigned_to || undefined,
      tags: row.tags || undefined,
      dueDate: row.due_date || undefined,
      priority: row.priority,
      timeSpent: row.time_spent || undefined,
    }));

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
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

    const userId = user.id;
    const taskData = req.body;

    // Convert Task to database insert type
    const taskInsert = {
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      created_by: userId,
      user_id: userId,
      assigned_to: taskData.assignedTo || null,
      tags: taskData.tags || [],
      due_date: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : null,
      time_spent: taskData.timeSpent || null
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskInsert)
      .select()
      .single();

    if (error) throw error;

    // Convert database row to Task type
    const task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
      assignedTo: data.assigned_to || undefined,
      tags: data.tags || undefined,
      dueDate: data.due_date || undefined,
      priority: data.priority,
      timeSpent: data.time_spent || undefined,
    };

    return res.status(201).json(task);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
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

    const userId = user.id;
    const taskId = req.params.id;
    const updates = req.body;

    // Convert Task to database update type
    const updateData = {
      title: updates.title,
      description: updates.description,
      status: updates.status,
      priority: updates.priority,
      assigned_to: updates.assignedTo || null,
      tags: updates.tags || null,
      due_date: updates.dueDate || null,
      time_spent: updates.timeSpent || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('user_id', userId) // Ensure user can only update their own tasks
      .select()
      .single();

    if (error) throw error;

    // Convert database row to Task type
    const task = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      createdBy: data.created_by,
      assignedTo: data.assigned_to || undefined,
      tags: data.tags || undefined,
      dueDate: data.due_date || undefined,
      priority: data.priority,
      timeSpent: data.time_spent || undefined,
    };

    return res.status(200).json(task);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
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

    const userId = user.id;
    const taskId = req.params.id;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId); // Ensure user can only delete their own tasks

    if (error) throw error;

    return res.status(204).end();
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// AI endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
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
      const error = await response.json();
      console.error('API Error:', error);
      throw new Error(`API request failed: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json({
      content: data.choices[0]?.message?.content || "I couldn't generate a response. Please try again."
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
