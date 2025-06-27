import { auth } from '../lib/supabase';

export class User {
  static async me() {
    const user = await auth.getUser();
    if (!user) return null;
    
    // Get profile data
    const profile = await auth.updateProfile({}); // Empty update to get current profile
    
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.data?.full_name || user.user_metadata?.full_name || 'User',
      avatar_url: profile?.data?.avatar_url || user.user_metadata?.avatar_url,
      created_at: user.created_at,
      role: user.role || 'user'
    };
  }

  static async updateProfile(updates) {
    const { data, error } = await auth.updateProfile(updates);
    if (error) throw error;
    return data;
  }
}
