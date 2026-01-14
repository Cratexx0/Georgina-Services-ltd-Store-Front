import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiService } from './ApiService';

export interface User {
  id: string;
  email: string;
  fullname: string;
  name?: string;
  role: string;
  phoneNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  loginWithFacebook: (accessToken: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>; // Remove const here
  clearError: () => void; // Add this
}

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on app start and page refresh
  useEffect(() => {
    checkAuth();
  }, []);

  // Remove const from method declaration
  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
      
      if (!token || token === 'null' || token === 'undefined') {
        clearAuthData();
        return false;
      }

      if (savedUser && savedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          return true;
        } catch (err) {
          console.error('❌ Failed to parse saved user:', err);
          clearAuthData();
          return false;
        }
      }

      try {
        const verifyResponse = await apiService.verifyToken();

        const currentUserResponse = await apiService.getCurrentUser();

        if (currentUserResponse.success && currentUserResponse.data) {
          const userDataFromBackend = currentUserResponse.data.user || currentUserResponse.data;
          const userData: User = {
            id: userDataFromBackend.id,
            email: userDataFromBackend.email,
            fullname: userDataFromBackend.fullname || userDataFromBackend.name || '',
            name: userDataFromBackend.name,
            role: userDataFromBackend.role,
            phoneNumber: userDataFromBackend.phoneNumber || userDataFromBackend.contact
          };
          
          setUser(userData);
          sessionStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('user', JSON.stringify(userData));
          
          return true;
        } else {
          throw new Error('Failed to get user data from response');
        }
      } catch (userError: any) {
        console.error('❌ Failed to verify token or get user data:', userError);
        
        if (userError.message?.includes('401') || userError.message?.includes('Invalid token')) {
          clearAuthData();
          return false;
        }
        
        return false;
      }
    } catch (err) {
      console.error('❌ Auth check failed:', err);
      clearAuthData();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove const from method declaration
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      clearAuthData();
      
      const response = await apiService.login(email, password);

      const token = response.token || response.accessToken || response.data?.token;

      if (!token) {
        console.error('🔐 [AUTH-5] NO TOKEN AFTER EXTRACTION. Full response:', response);
        throw new Error('Token extraction failed. Server response: ' + JSON.stringify(response));
      }

      const userDataFromBackend = response.user || response.data?.user;
      console.log('🔐 [AUTH-6] User data from backend:', userDataFromBackend);

      if (!userDataFromBackend) {
        console.error('🔐 [AUTH-7] NO USER DATA. Available keys:', Object.keys(response));
        throw new Error('No user data received. Available data: ' + JSON.stringify(response));
      }

      const userData: User = {
        id: userDataFromBackend.id,
        email: userDataFromBackend.email,
        fullname: userDataFromBackend.fullname || userDataFromBackend.name || '',
        name: userDataFromBackend.name,
        role: userDataFromBackend.role,
        phoneNumber: userDataFromBackend.phoneNumber || userDataFromBackend.contact
      };

      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      localStorage.setItem('token', token);

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      setUser(userData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('🔐 [AUTH-ERROR] Login failed:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: 'google' | 'facebook',
    token: string
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error(
          provider === 'google'
            ? 'Missing Google idToken'
            : 'Missing Facebook access token'
        );
      }

      clearAuthData();

      const response =
        provider === 'google'
          ? await apiService.socialLoginGoogle(token)
          : await apiService.socialLoginFacebook(token);

      const authToken = response.token || response.data?.token;
      const userDataFromBackend = response.user || response.data?.user;

      if (!authToken || !userDataFromBackend) {
        throw new Error('Social login failed: missing token or user data');
      }

      const userData: User = {
        id: userDataFromBackend.id,
        email: userDataFromBackend.email,
        fullname: userDataFromBackend.fullname || userDataFromBackend.name || '',
        name: userDataFromBackend.name,
        role: userDataFromBackend.role,
        phoneNumber: userDataFromBackend.phoneNumber || userDataFromBackend.contact,
      };

      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', authToken);
      localStorage.setItem('token', authToken);

      setUser(userData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Social login failed. Please try again.';
      setError(errorMessage);
      clearAuthData();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // const loginWithGoogle = async (accessToken: string) =>
  const loginWithGoogle = async (idToken: string): Promise<void> => {

  if (!idToken) {
    throw new Error('Google ID token is required');
  }
  
  try {
    setLoading(true);
    setError(null);
    
    clearAuthData();
    
    // Call the correct API endpoint for Google ID tokens
    const response = await apiService.socialLoginGoogle(idToken);
    
    const authToken = response.token || response.data?.token;
    const userDataFromBackend = response.user || response.data?.user;
    
    if (!authToken) {
      console.error('🔐 [GOOGLE-AUTH] No auth token in response:', response);
      throw new Error('Authentication failed: No token received from server');
    }
    
    if (!userDataFromBackend) {
      console.error('🔐 [GOOGLE-AUTH] No user data in response:', response);
      throw new Error('Authentication failed: No user data received');
    }
    
    const userData: User = {
      id: userDataFromBackend.id,
      email: userDataFromBackend.email,
      fullname: userDataFromBackend.fullname || userDataFromBackend.name || userDataFromBackend.email,
      name: userDataFromBackend.name,
      role: userDataFromBackend.role || 'user',
      phoneNumber: userDataFromBackend.phoneNumber || userDataFromBackend.contact
    };
    
    // Store in both session and local storage
    sessionStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('token', authToken);
    localStorage.setItem('token', authToken);
    
    // Verify storage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    setUser(userData);

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Google authentication failed';
    setError(errorMessage);
    console.error('❌ [GOOGLE-AUTH] Error:', errorMessage);
    clearAuthData(); // Clear on error
    throw err;
  } finally {
    setLoading(false);
  }
};
    // handleSocialLogin('google', accessToken);

  const loginWithFacebook = async (accessToken: string) =>
    handleSocialLogin('facebook', accessToken);

  // Remove const from method declaration
  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('👤 Registering user:', { name, email });
      
      if (!name.trim() || !email.trim() || !password) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const response = await apiService.register({
        name: name.trim(),
        email: email.trim(),
        password
      });
      

      if (response.success || response.message?.includes('success') || response.data) {
        console.log('✅ Registration successful, attempting login...');
        await login(email, password);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
      
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('❌ Registration error:', errorMessage);
      clearAuthData();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove const from method declaration
  const logout = (): void => {
    clearAuthData();
  };

  // Remove const from method declaration
  const clearAuthData = (): void => {
    setUser(null);
    setError(null);
    
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Remove const from method declaration
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.forgotPassword(email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process password reset request.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove const from method declaration
  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.resetPassword(token, newPassword);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove const from method declaration - Add refreshToken method
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await apiService.verifyToken();
      return response.success;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return false;
    }
  };

  // Remove const from method declaration - Add clearError method
  const clearError = (): void => {
    setError(null);
  };

  // Add auto-logout on token expiry
  useEffect(() => {
    const checkTokenExpiry = async (): Promise<void> => {
      if (user) {
        const isValid = await refreshToken();
        if (!isValid) {
          logout();
        }
      }
    };

    // Check token every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    register,
    forgotPassword,
    resetPassword,
    loading,
    error,
    checkAuth,
    refreshToken, // Now properly defined
    clearError // Add this
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context itself if needed for direct consumption
export { AuthContext };