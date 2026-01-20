export interface Database {
  public: {
    Tables: {
      user_credentials: {
        Row: {
          id: string;
          user_id: string;
          n8n_url: string;
          encrypted_api_key: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          n8n_url: string;
          encrypted_api_key: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          n8n_url?: string;
          encrypted_api_key?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export interface UserCredentials {
  n8nUrl: string;
  apiKey: string;
}
