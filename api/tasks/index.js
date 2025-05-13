// API endpoint for tasks operations
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

// Convert database row to Task type
function toTask(row) {
  return {
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
  };
}

// Convert Task to database insert type
function toTaskInsert(task, userId) {
  return {
    title: task.title || 'Untitled Task',
    description: task.description || '',
    status: task.status || 'todo',
    priority: task.priority || 'medium',
    created_by: userId,
    user_id: userId,
    assigned_to: task.assignedTo || null,
    tags: task.tags || [],
    due_date: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    time_spent: task.timeSpent || null
  };
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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

  const userId = user.id;

  // Handle different HTTP methods
  try {
    if (req.method === 'GET') {
      // Fetch tasks for the user
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data.map(toTask));
    }
    else if (req.method === 'POST') {
      // Create a new task
      const taskData = req.body;

      const { data, error } = await supabase
        .from('tasks')
        .insert(toTaskInsert(taskData, userId))
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json(toTask(data));
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
