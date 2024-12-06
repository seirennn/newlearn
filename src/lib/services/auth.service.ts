import { db } from '@/lib/firebase';
import { UserProfile, LoginActivity, UserLocation } from '@/types/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { UAParser } from 'ua-parser-js';

export class AuthService {
  private static async getUserLocation(): Promise<UserLocation> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        state: data.region || 'Unknown',
        city: data.city || 'Unknown',
        ip: data.ip || 'Unknown',
      };
    } catch (error) {
      console.error('Error fetching location:', error);
      return {
        country: 'Unknown',
        state: 'Unknown',
        city: 'Unknown',
        ip: 'Unknown',
      };
    }
  }

  private static getDeviceInfo(): {
    browser: string;
    os: string;
    device: string;
  } {
    try {
      const parser = new UAParser();
      const result = parser.getResult();
      return {
        browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
        os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
        device: result.device.type || 'desktop',
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return {
        browser: 'Unknown',
        os: 'Unknown',
        device: 'Unknown',
      };
    }
  }

  static async createUserProfile(
    uid: string,
    email: string,
    fullName: string,
    photoURL: string = '',
    provider: string = 'email'
  ): Promise<void> {
    try {
      const location = await this.getUserLocation();
      const deviceInfo = this.getDeviceInfo();
      const timestamp = Timestamp.now();

      const userProfile: UserProfile = {
        uid,
        email,
        fullName,
        photoURL,
        provider,
        createdAt: timestamp.toDate(),
        lastLoginAt: timestamp.toDate(),
        location,
        deviceInfo,
      };

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });

      // Log signup activity
      await this.logLoginActivity(uid, email, provider, 'signup', true);
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  static async updateUserProfile(
    uid: string,
    data: Partial<UserProfile>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        lastLoginAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  static async logLoginActivity(
    uid: string,
    email: string,
    provider: string,
    action: 'signin' | 'signup' | 'logout',
    success: boolean
  ): Promise<void> {
    try {
      const location = await this.getUserLocation();
      const deviceInfo = this.getDeviceInfo();
      const timestamp = Timestamp.now();

      const activity: LoginActivity = {
        uid,
        email,
        timestamp: timestamp.toDate(),
        success,
        provider,
        location,
        deviceInfo,
        action,
      };

      const activityRef = doc(collection(db, 'login_activity'));
      await setDoc(activityRef, {
        ...activity,
        timestamp: serverTimestamp(),
      });

      // Update last login time in user profile if login was successful
      if (success && (action === 'signin' || action === 'signup')) {
        await this.updateUserProfile(uid, {
          lastLoginAt: timestamp.toDate() as Date,
          location,
        });
      }
    } catch (error) {
      console.error('Error logging login activity:', error);
      // Don't throw error here to prevent blocking the auth flow
    }
  }
}
