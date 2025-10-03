import { supabase, hasSupabase } from './supabaseClient.js';
import { mockData, delay } from './mockData.js';

export const dataService = {
  async getPraxisInfo() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.praxisInfo;
    }

    const { data, error } = await supabase
      .from('praxis_info')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching praxis info:', error);
      return mockData.praxisInfo;
    }
    return data;
  },

  async getOpeningHours() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.openingHours;
    }

    const { data, error } = await supabase
      .from('opening_hours')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching opening hours:', error);
      return mockData.openingHours;
    }
    return data;
  },

  async getTreatments() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.treatments;
    }

    const { data, error } = await supabase
      .from('treatments')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching treatments:', error);
      return mockData.treatments;
    }
    return data;
  },

  async getVideos() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.videos;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
      return mockData.videos;
    }
    return data;
  },

  async getAftercare() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.aftercare;
    }

    const { data, error } = await supabase
      .from('aftercare')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching aftercare:', error);
      return mockData.aftercare;
    }
    return data;
  },

  async getDesignSettings() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.designSettings;
    }

    const { data, error } = await supabase
      .from('design_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching design settings:', error);
      return mockData.designSettings;
    }
    return data;
  },

  async getEmergencyInfo() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.emergencyInfo;
    }

    const { data, error } = await supabase
      .from('emergency_info')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching emergency info:', error);
      return mockData.emergencyInfo;
    }
    return data;
  },

  async getNews() {
    if (!hasSupabase) {
      await delay(300);
      return mockData.news;
    }

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return mockData.news;
    }
    return data;
  },

  subscribeToTable(tableName, callback) {
    if (!hasSupabase) {
      console.log('Real-time updates disabled - using mock data');
      return null;
    }

    const channel = supabase
      .channel(`${tableName}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log(`Change in ${tableName}:`, payload);
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  },

  unsubscribe(channel) {
    if (channel && hasSupabase) {
      supabase.removeChannel(channel);
    }
  }
};
