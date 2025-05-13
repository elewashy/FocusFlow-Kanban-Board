import type { User } from '@/types';
import { API_BASE_URL } from '@/config';

// Get the current auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Get the current user from localStorage
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
}

// Check if the user is authenticated
export async function checkAuth(): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign in');
  }

  const data = await response.json();

  // Store user and token in localStorage
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('authToken', data.token);

  return data.user;
}

// Sign up with email and password
export async function signUp(email: string, password: string, name: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sign up');
  }
}

// Sign out
export async function signOut(): Promise<void> {
  const token = getAuthToken();

  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Clear local storage regardless of API response
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reset password');
  }
}

// Update password
export async function updatePassword(password: string): Promise<User> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update password');
  }

  const data = await response.json();

  // Update user in localStorage
  localStorage.setItem('user', JSON.stringify(data.user));

  return data.user;
}
