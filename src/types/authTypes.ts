import { CognitiveProfile, UserJourneyType } from '../types';

export type AuthFlowStep = 
  | 'SPLASH' 
  | 'PORTAL' 
  | 'LOGIN' 
  | 'SIGNUP' 
  | 'ONBOARDING_TUTORIAL' 
  | 'APP';

export interface UserAccount {
  id: string;
  email: string;
  personName: string;
  headline?: string;
  targetTitle?: string;
  targetRomeCode?: string;
  journeyType: UserJourneyType;
  avatarUrl?: string;
  createdAt: string;
  lastLoginAt: string;
  hasCompletedOnboarding: boolean;
  profileId: string;
}

export interface AuthSessionState {
  isAuthenticated: boolean;
  currentUserId: string | null;
  hasSeenSplashThisSession: boolean;
}
