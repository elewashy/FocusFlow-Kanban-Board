import type { Task } from '@/types';
import { getAuthToken } from './auth';
import { API_BASE_URL } from '@/config';

// Helper function to make authenticated API requests
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Check if response has content before trying to parse JSON
  const contentType = response.headers.get('content-type');
  const hasJsonContent = contentType && contentType.includes('application/json');

  if (!response.ok) {
    const error = hasJsonContent 
      ? await response.json().catch(() => ({ error: response.statusText }))
      : { error: response.statusText };
    console.error('API request failed:', error);
    throw new Error(error.error || 'API request failed');
  }

  // For 204 No Content or empty responses, return default success message
  if (response.status === 204 || !hasJsonContent) {
    return { message: 'Operation completed successfully' } as T;
  }

  return response.json();
}

export async function fetchUserTasks(): Promise<Task[]> {
  try {
    return await apiRequest<Task[]>(`${API_BASE_URL}/api/tasks`);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export async function createTask(taskData: Partial<Task>): Promise<Task> {
  try {
    return await apiRequest<Task>(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  try {
    return await apiRequest<Task>(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

export async function deleteTask(id: string): Promise<{ message: string }> {
  try {
    return await apiRequest<{ message: string }>(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE'
    });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    throw new Error(error.message || 'Failed to delete task');
  }
}
