// API endpoint for confirming password reset
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

  try {
    const { password, token } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    console.log('Attempting to update password with token');

    // Try a direct approach using the Supabase API
    try {
      // Make a direct request to Supabase API
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          password: password
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error from Supabase API:', responseData);
        return res.status(response.status).json({
          error: responseData.error || 'Failed to update password',
          details: responseData
        });
      }

      console.log('Password updated successfully via direct API');
      const data = responseData;
      return res.status(200).json({
        message: 'Password has been reset successfully',
        user: {
          id: data.id,
          email: data.email
        }
      });
    } catch (apiError) {
      console.error('API request error:', apiError);
      return res.status(500).json({ error: 'Failed to communicate with authentication service' });
    }

    // The code above should have returned already, so we shouldn't get here

    return res.status(200).json({
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
