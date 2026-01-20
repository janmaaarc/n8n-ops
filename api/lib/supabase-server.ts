import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Create a Supabase client with the service role key for server-side operations.
 * This bypasses RLS and should only be used on the server.
 */
export const createServerClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

/**
 * Verify a user's access token and return the user info
 */
export const verifyAccessToken = async (accessToken: string) => {
  const client = createServerClient();
  if (!client) return null;

  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) return null;

  return data.user;
};

/**
 * Get user's n8n credentials from the database
 */
export const getUserCredentials = async (userId: string) => {
  const client = createServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from('user_credentials')
    .select('n8n_url, encrypted_api_key')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return data;
};
