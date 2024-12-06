export interface UserLocation {
  country: string;
  state: string;
  city: string;
  ip: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  provider: string;
  location: UserLocation;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
  };
}

export interface LoginActivity {
  uid: string;
  email: string;
  timestamp: Date;
  success: boolean;
  provider: string;
  location: UserLocation;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
  };
  action: 'signin' | 'signup' | 'logout';
}
