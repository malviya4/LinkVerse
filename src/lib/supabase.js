import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export const auth = {
  // Sign up new user
  signUp: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  },

  // Sign in existing user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Update user profile
  updateProfile: async (updates) => {
    const user = await auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  }
};

// Database helper functions
export const db = {
  // Links CRUD operations
  links: {
    create: async (link) => {
      const user = await auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('links')
        .insert([{ ...link, user_id: user.id }])
        .select()
        .single();

      return { data, error };
    },

    list: async (filters = {}) => {
      const user = await auth.getUser();
      if (!user) throw new Error('No user logged in');

      let query = supabase
        .from('links')
        .select('*, collections(name, color, icon)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.collection_id) {
        query = query.eq('collection_id', filters.collection_id);
      }
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.is_favorite) {
        query = query.eq('is_favorite', true);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,url.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      return { data, error };
    },

    get: async (id) => {
      const { data, error } = await supabase
        .from('links')
        .select('*, collections(name, color, icon)')
        .eq('id', id)
        .single();

      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      return { error };
    },

    toggleFavorite: async (id, is_favorite) => {
      const { data, error } = await supabase
        .from('links')
        .update({ is_favorite })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    updateLastAccessed: async (id) => {
      const { data, error } = await supabase
        .from('links')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    }
  },

  // Collections CRUD operations
  collections: {
    create: async (collection) => {
      const user = await auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('collections')
        .insert([{ ...collection, user_id: user.id }])
        .select()
        .single();

      return { data, error };
    },

    list: async () => {
      const user = await auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('collections')
        .select('*, links(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return { data, error };
    },

    get: async (id) => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error };
    },

    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    },

    delete: async (id) => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      return { error };
    }
  },

  // Stats
  stats: {
    get: async () => {
      const user = await auth.getUser();
      if (!user) throw new Error('No user logged in');

      const [linksResult, collectionsResult, favoritesResult] = await Promise.all([
        supabase.from('links').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('collections').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('links').select('id', { count: 'exact' }).eq('user_id', user.id).eq('is_favorite', true)
      ]);

      return {
        links: linksResult.count || 0,
        collections: collectionsResult.count || 0,
        favorites: favoritesResult.count || 0
      };
    }
  }
};
