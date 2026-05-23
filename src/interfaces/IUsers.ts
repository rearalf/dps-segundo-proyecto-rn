export interface FirebaseUser {
  _redirectEventId: string;
  apiKey: string;
  appName: string;
  createdAt: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  lastLoginAt: string;
  phoneNumber: string;
  photoURL: string;
  providerData: ProviderData[][];
  stsTokenManager: StsTokenManager;
  tenantId: string;
  uid: string;
}

export interface ProviderData {
  [key: string]: any;
}

export interface StsTokenManager {
  accessToken: string;
  expirationTime: number;
  refreshToken: string;
}
