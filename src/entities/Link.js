import { db } from '../lib/supabase';

export class Link {
  static async create(linkData) {
    const { data, error } = await db.links.create(linkData);
    if (error) throw error;
    return data;
  }

  static async list(filters = {}) {
    const { data, error } = await db.links.list(filters);
    if (error) throw error;
    return data;
  }

  static async get(id) {
    const { data, error } = await db.links.get(id);
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await db.links.update(id, updates);
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await db.links.delete(id);
    if (error) throw error;
    return true;
  }

  static async toggleFavorite(id, isFavorite) {
    const { data, error } = await db.links.toggleFavorite(id, isFavorite);
    if (error) throw error;
    return data;
  }

  static async updateLastAccessed(id) {
    const { data, error } = await db.links.updateLastAccessed(id);
    if (error) throw error;
    return data;
  }

  // Helper method to extract domain from URL
  static extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return '';
    }
  }

  // Helper method to categorize URL
  static categorizeUrl(url) {
    const domain = this.extractDomain(url).toLowerCase();
    
    const categoryMap = {
      'youtube.com': 'video',
      'vimeo.com': 'video',
      'twitch.tv': 'video',
      'facebook.com': 'social_media',
      'twitter.com': 'social_media',
      'instagram.com': 'social_media',
      'linkedin.com': 'social_media',
      'github.com': 'development',
      'stackoverflow.com': 'development',
      'developer.mozilla.org': 'documentation',
      'amazon.com': 'shopping',
      'ebay.com': 'shopping',
      'medium.com': 'blog',
      'dev.to': 'blog',
      'dribbble.com': 'design',
      'behance.net': 'design',
      'figma.com': 'design'
    };

    for (const [key, category] of Object.entries(categoryMap)) {
      if (domain.includes(key)) {
        return category;
      }
    }

    return 'other';
  }
}
