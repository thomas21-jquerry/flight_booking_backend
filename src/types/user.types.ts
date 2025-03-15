export interface UserProfile {
  user_id: string;
  full_name: string;
  profile_photo_url?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
}

export type ProfileResponse = UserProfile; 