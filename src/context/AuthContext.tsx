import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { api, User, tokenManager } from '../services/api';

export type Sign = {
  email: string;
  password: string;
  callback?: VoidFunction;
};

export type Error = {
  code: string | number;
  message: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: ({ email, password, callback }: Sign) => Promise<User>;
  login: ({ email, password, callback }: Sign) => Promise<User>;
  logout: () => Promise<void>;
  sendPswdResetEmail: (email: string) => Promise<boolean>;
  confirmPswdReset: (token: string, password: string) => Promise<boolean>;
  editProfile: (data: Partial<User>) => Promise<void>;
  userDelete: () => Promise<void>;
  error?: Error;
  resetError: () => void;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const ProvideAuth = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within ProvideAuth');
  }
  return context;
};

function useProvideAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get a valid token (will use refresh token if access token is missing/expired)
        const token = await tokenManager.getValidToken();

        if (token) {
          // We have a valid token, fetch user profile
          const profile = await api.getProfile();
          setUser(profile);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        tokenManager.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    if (!tokenManager.getAccessToken()) {
      setUser(null);
      return;
    }

    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
      setUser(null);
      tokenManager.clearTokens();
    }
  }, []);

  const register = async ({ email, password, callback }: Sign): Promise<User> => {
    try {
      setError(undefined);
      const response = await api.register(email, password);
      setUser(response.user);
      if (callback) callback();
      return response.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed';
      setError({
        code: 'registration-error',
        message: errorMessage,
      });
      throw err;
    }
  };

  const login = async ({ email, password, callback }: Sign): Promise<User> => {
    try {
      setError(undefined);
      const response = await api.login(email, password);
      setUser(response.user);
      if (callback) callback();
      return response.user;
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError({
        code: 'login-error',
        message: errorMessage,
      });
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      tokenManager.clearTokens();
    }
  };

  const sendPswdResetEmail = async (email: string): Promise<boolean> => {
    try {
      setError(undefined);
      await api.forgotPassword(email);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send password reset email';
      setError({
        code: 'password-reset-error',
        message: errorMessage,
      });
      return false;
    }
  };

  const confirmPswdReset = async (
    token: string,
    password: string
  ): Promise<boolean> => {
    try {
      setError(undefined);
      await api.resetPassword(token, password);
      return true;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reset password';
      setError({
        code: 'password-reset-confirm-error',
        message: errorMessage,
      });
      return false;
    }
  };

  const editProfile = async (data: Partial<User>): Promise<void> => {
    try {
      setError(undefined);
      const updatedUser = await api.updateProfile(data);
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      setError({
        code: 'profile-update-error',
        message: errorMessage,
      });
      throw err;
    }
  };

  const uploadAvatar = async (file: File): Promise<void> => {
    try {
      setError(undefined);
      const updatedUser = await api.uploadUserAvatar(file);
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload avatar';
      setError({
        code: 'avatar-upload-error',
        message: errorMessage,
      });
      throw err;
    }
  };

  const deleteAvatar = async (): Promise<void> => {
    try {
      setError(undefined);
      const updatedUser = await api.deleteUserAvatar();
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete avatar';
      setError({
        code: 'avatar-delete-error',
        message: errorMessage,
      });
      throw err;
    }
  };

  const userDelete = async (): Promise<void> => {
    try {
      setError(undefined);
      await api.deleteAccount();
      setUser(null);
      tokenManager.clearTokens();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete account';
      setError({
        code: 'account-delete-error',
        message: errorMessage,
      });
      throw err;
    }
  };

  const resetError = () => setError(undefined);

  return {
    user,
    loading,
    register,
    login,
    logout,
    error,
    sendPswdResetEmail,
    confirmPswdReset,
    editProfile,
    userDelete,
    resetError,
    uploadAvatar,
    deleteAvatar,
    refreshUser,
  };
}
