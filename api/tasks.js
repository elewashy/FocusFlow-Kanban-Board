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

  // Check if this is a request for a specific task
  console.log('Request URL:', req.url);

  // Extract task ID from URL path or query parameters
  let taskId = null;

  // Try to get from query parameters first
  if (req.query && req.query.id) {
    taskId = req.query.id;
  }
  // Otherwise extract from URL path
  else {
    const urlParts = req.url.split('/');
    console.log('URL parts:', urlParts);

    // Find the tasks part and get the next segment
    const taskIdIndex = urlParts.indexOf('tasks') + 1;
    if (taskIdIndex < urlParts.length) {
      taskId = urlParts[taskIdIndex].split('?')[0]; // Remove query string if present
    }
  }

  console.log('Extracted task ID:', taskId);

  // Handle different HTTP methods
  try {
    // If taskId is present in the URL, handle single task operations
    if (taskId && taskId !== 'tasks.js') {
      if (req.method === 'PUT' || req.method === 'PATCH') {
        // Update task
        console.log('Processing PUT/PATCH request for task ID:', taskId);

        // Parse request body if it's a string
        let updates = req.body;
        if (typeof updates === 'string') {
          try {
            updates = JSON.parse(updates);
          } catch (e) {
            console.error('Error parsing request body:', e);
            return res.status(400).json({ error: 'Invalid request body format' });
          }
        }

        console.log('Request body:', updates);

        // Validate required fields
        if (!updates) {
          return res.status(400).json({ error: 'Request body is required' });
        }

        // Build update data object
        const updateData = {};

        // Only include fields that are present in the request
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.status !== undefined) updateData.status = updates.status;
        if (updates.priority !== undefined) updateData.priority = updates.priority;
        if (updates.assignedTo !== undefined) updateData.assigned_to = updates.assignedTo;
        if (updates.tags !== undefined) updateData.tags = updates.tags;
        if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
        if (updates.timeSpent !== undefined) updateData.time_spent = updates.timeSpent;

        // Always update the updated_at timestamp
        updateData.updated_at = new Date().toISOString();

        console.log('Update data:', updateData);

        try {
          const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', taskId)
            .eq('user_id', userId) // Ensure user can only update their own tasks
            .select()
            .single();

          if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
          }

          if (!data) {
            return res.status(404).json({ error: 'Task not found' });
          }

          console.log('Updated task:', data);
          return res.status(200).json(toTask(data));
        } catch (dbError) {
          console.error('Database operation error:', dbError);
          return res.status(500).json({ error: 'Database operation failed', details: dbError.message });
        }
      }
      else if (req.method === 'DELETE') {
        // Delete task
        console.log('Processing DELETE request for task ID:', taskId);

        try {
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_id', userId); // Ensure user can only delete their own tasks

          if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
          }

          console.log('Task deleted successfully');
          return res.status(204).end();
        } catch (dbError) {
          console.error('Database operation error:', dbError);
          return res.status(500).json({ error: 'Database operation failed', details: dbError.message });
        }
      }
      else {
        return res.status(405).json({ error: 'Method not allowed for single task' });
      }
    }
    // Handle collection operations
    else {
      if (req.method === 'GET') {
        // Fetch tasks for the user
        console.log('Processing GET request for all tasks');

        try {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
          }

          console.log(`Retrieved ${data.length} tasks`);
          return res.status(200).json(data.map(toTask));
        } catch (dbError) {
          console.error('Database operation error:', dbError);
          return res.status(500).json({ error: 'Database operation failed', details: dbError.message });
        }
      }
      else if (req.method === 'POST') {
        // Create a new task
        console.log('Processing POST request to create a new task');

        // Parse request body if it's a string
        let taskData = req.body;
        if (typeof taskData === 'string') {
          try {
            taskData = JSON.parse(taskData);
          } catch (e) {
            console.error('Error parsing request body:', e);
            return res.status(400).json({ error: 'Invalid request body format' });
          }
        }

        console.log('Request body:', taskData);

        // Validate required fields
        if (!taskData) {
          return res.status(400).json({ error: 'Request body is required' });
        }

        try {
          const { data, error } = await supabase
            .from('tasks')
            .insert(toTaskInsert(taskData, userId))
            .select()
            .single();

          if (error) {
            console.error('Supabase error:', error);
            return res.status(400).json({ error: error.message });
          }

          console.log('Created new task:', data);
          return res.status(201).json(toTask(data));
        } catch (dbError) {
          console.error('Database operation error:', dbError);
          return res.status(500).json({ error: 'Database operation failed', details: dbError.message });
        }
      }
      else {
        return res.status(405).json({ error: 'Method not allowed for task collection' });
      }
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }
}
