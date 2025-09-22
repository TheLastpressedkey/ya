import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket for images
export const STORAGE_BUCKET = 'portfolio-images';

// Helper functions for storage
export const uploadImage = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);
  
  return publicUrl;
};

export const deleteImage = async (path: string) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([path]);
  
  if (error) throw error;
}