// API endpoint for operations on a specific task
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
  // Get task ID from query parameter or URL path
  const taskId = req.query.id || (req.url.split('/').pop().split('?')[0]);

  // Handle different HTTP methods
  try {
    if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update task
      const updates = req.body;

      const updateData = {
        title: updates.title || 'Untitled Task',
        description: updates.description || '',
        status: updates.status || 'todo',
        priority: updates.priority || 'medium',
        user_id: userId,  // Ensure user_id is included
        assigned_to: updates.assignedTo || null,
        tags: updates.tags || [],
        due_date: updates.dueDate ? new Date(updates.dueDate).toISOString() : null,
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

      if (error) {
        console.error('Supabase update error:', error);
        throw new Error(`Failed to update task: ${error.message}`);
      }

      return res.status(200).json(toTask(data));
    }
    else if (req.method === 'DELETE') {
      // Delete task
      // First verify task exists and belongs to user
      const { data: task, error: checkError } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('id', taskId)
        .eq('user_id', userId)
        .single();

      if (checkError || !task) {
        console.error('Task not found or unauthorized:', checkError);
        return res.status(404).json({ 
          error: 'Task not found',
          message: 'Task does not exist or you do not have permission to delete it'
        });
      }

      // Proceed with deletion
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Delete error:', deleteError);
        throw new Error(`Failed to delete task: ${deleteError.message}`);
      }

      return res.status(200).json({ 
        message: `Task "${task.title}" deleted successfully`
      });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
