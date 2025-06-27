import { db } from '../lib/supabase';

export class Collection {
  static async create(collectionData) {
    const { data, error } = await db.collections.create(collectionData);
    if (error) throw error;
    return data;
  }

  static async list() {
    const { data, error } = await db.collections.list();
    if (error) throw error;
    return data;
  }

  static async get(id) {
    const { data, error } = await db.collections.get(id);
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await db.collections.update(id, updates);
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await db.collections.delete(id);
    if (error) throw error;
    return true;
  }

  // Helper method to get links count for a collection
  static async getLinksCount(collectionId) {
    const { data } = await db.links.list({ collection_id: collectionId });
    return data ? data.length : 0;
  }

  // Predefined collection colors
  static colors = [
    '#4f8ff7', // Blue
    '#f76f4f', // Red
    '#4ff76f', // Green
    '#f7cf4f', // Yellow
    '#cf4ff7', // Purple
    '#4ff7f7', // Cyan
    '#f74f8f', // Pink
    '#8ff74f', // Lime
    '#f78f4f', // Orange
    '#4f4ff7'  // Indigo
  ];

  // Predefined collection icons (Lucide icon names)
  static icons = [
    'Folder',
    'Star',
    'Heart',
    'Bookmark',
    'Tag',
    'Archive',
    'Box',
    'Briefcase',
    'Calendar',
    'Camera'
  ];
}
