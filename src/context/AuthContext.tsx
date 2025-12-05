
// // import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// // import { apiService, User as ApiUser } from '../lib/api';

// // interface User {
// //   id: string;
// //   email: string;
// //   name: string;
// //   role: string;
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   isAuthenticated: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => void;
// //   register: (name: string, email: string, password: string) => Promise<void>;
// //   forgotPassword: (email: string) => Promise<void>;
// //   resetPassword: (token: string, newPassword: string) => Promise<void>;
// //   loading: boolean;
// //   error: string | null;
// // }

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // };

// // interface AuthProviderProps {
// //   children: ReactNode;
// // }

// // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     // Check localStorage for existing user
// //     const savedUser = localStorage.getItem('user');
// //     const token = localStorage.getItem('auth_token');
    
// //     if (savedUser && token) {
// //       setUser(JSON.parse(savedUser));
// //     }
// //     setLoading(false);
// //   }, []);

// //   const login = async (email: string, password: string) => {
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       // Temporary auto-login - no validation needed
// //       await new Promise(resolve => setTimeout(resolve, 500));
      
// //       // Mock user data based on email
// //       const mockUser: User = {
// //         id: Date.now().toString(),
// //         email,
// //         name: email.split('@')[0] || 'Guest User',
// //         role: 'user',
// //       };
      
// //       setUser(mockUser);
// //       localStorage.setItem('user', JSON.stringify(mockUser));
// //     } catch (err) {
// //       setError('Login failed. Please try again.');
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   const logout = () => {
// //     setUser(null);
// //     localStorage.removeItem('user');
// //     apiService.clearToken();
// //   };

// //   const register = async (name: string, email: string, password: string) => {
// //     setLoading(true);
// //     setError(null);
    
// //     try {
// //       // Temporary auto-register - no validation needed
// //       await new Promise(resolve => setTimeout(resolve, 500));
      
// //       // Auto-login after registration
// //       const mockUser: User = {
// //         id: Date.now().toString(),
// //         email,
// //         name,
// //         role: 'user',
// //       };
      
// //       setUser(mockUser);
// //       localStorage.setItem('user', JSON.stringify(mockUser));
// //     } catch (err) {
// //       setError('Registration failed. Please try again.');
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const forgotPassword = async (email: string) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       await apiService.forgotPassword(email);
// //     } catch (err) {
// //       setError('Failed to process password reset request.');
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetPassword = async (token: string, newPassword: string) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       await apiService.resetPassword(token, newPassword);
// //     } catch (err) {
// //       setError('Failed to reset password.');
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <AuthContext.Provider
// //       value={{
// //         user,
// //         isAuthenticated: !!user,
// //         login,
// //         logout,
// //         register,
// //         forgotPassword,
// //         resetPassword,
// //         loading,
// //         error
// //       }}
// //     >
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };



// // import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// // import { apiService } from './ApiService';

// // export interface User {
// //   id: string;
// //   email: string;
// //   firstName: string;
// //   lastName: string;
// //   name?: string; // Computed from firstName + lastName
// //   role: string;
// //   phoneNumber?: string;
// // }

// // export interface AuthContextType {
// //   user: User | null;
// //   isAuthenticated: boolean;
// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => void;
// //   register: (name: string, email: string, password: string) => Promise<void>;
// //   forgotPassword: (email: string) => Promise<void>;
// //   resetPassword: (token: string, newPassword: string) => Promise<void>;
// //   loading: boolean;
// //   error: string | null;
// // }

// // // Create the context with undefined as default value
// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (!context) {
// //     throw new Error('useAuth must be used within an AuthProvider');
// //   }
// //   return context;
// // };

// // interface AuthProviderProps {
// //   children: ReactNode;
// // }

// // export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     // Check for existing user session
// //     const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
// //     const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    
// //     if (savedUser && token) {
// //       try {
// //         setUser(JSON.parse(savedUser));
// //       } catch (err) {
// //         console.error('Failed to parse saved user:', err);
// //         // Clear invalid data
// //         sessionStorage.removeItem('user');
// //         localStorage.removeItem('user');
// //       }
// //     }
// //     setLoading(false);
// //   }, []);

// // const login = async (email: string, password: string) => {
// //   try {
// //     setLoading(true);
// //     setError(null);
// //     const response = await apiService.login(email, password);
    
// //     // Token can be in response.token or response.data.token
// //     const token = response.token || response.data?.token;
    
// //     if (!token) {
// //       throw new Error('No token received from server');
// //     }
    
// //     // Get user data from the correct location in response
// //     const userDataFromBackend = response.user || response.admin || response.data?.user || response.data?.admin;
    
// //     if (!userDataFromBackend) {
// //       throw new Error('No user data received from server');
// //     }
    
// //     console.log('✅ Login successful:', { email: userDataFromBackend.email, hasToken: !!token });
    
// //     // Create user data that matches your backend response
// //     const userData: User = {
// //       id: userDataFromBackend.id,
// //       email: userDataFromBackend.email,
// //       firstName: userDataFromBackend.name,
// //       lastName: '',
// //       name: userDataFromBackend.name,
// //       role: userDataFromBackend.role,
// //       phoneNumber: userDataFromBackend.contact
// //     };
    
// //     setUser(userData);
    
// //     // Store in both session and local storage for persistence
// //     sessionStorage.setItem('user', JSON.stringify(userData));
// //     localStorage.setItem('user', JSON.stringify(userData));
// //     sessionStorage.setItem('token', token);
// //     localStorage.setItem('token', token);
    
// //   } catch (err) {
// //     const errorMessage = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
// //     setError(errorMessage);
// //     throw err;
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // const register = async (name: string, email: string, password: string) => {
// //   try {
// //     setLoading(true);
// //     setError(null);
    
// //     // Register the user
// //     const response = await apiService.register({
// //       name,  // Just pass the single name field
// //       email,
// //       password
// //     });
    
// //     console.log('Register response:', response); // Debug log
    
// //     // After successful registration, log the user in
// //     await login(email, password);
// //   } catch (err) {
// //     const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
// //     setError(errorMessage);
// //     throw err;
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   const logout = () => {
// //     setUser(null);
    
// //     // Clear from both storages
// //     sessionStorage.removeItem('user');
// //     sessionStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //     localStorage.removeItem('token');
// //   };



// //   const forgotPassword = async (email: string) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       await apiService.forgotPassword(email);
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : 'Failed to process password reset request.';
// //       setError(errorMessage);
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetPassword = async (token: string, newPassword: string) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       await apiService.resetPassword(token, newPassword);
// //     } catch (err) {
// //       const errorMessage = err instanceof Error ? err.message : 'Failed to reset password.';
// //       setError(errorMessage);
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const value: AuthContextType = {
// //     user,
// //     isAuthenticated: !!user,
// //     login,
// //     logout,
// //     register,
// //     forgotPassword,
// //     resetPassword,
// //     loading,
// //     error
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // // Export the context itself if needed for direct consumption
// // export { AuthContext };

// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { apiService } from './ApiService';

// export interface User {
//   id: string;
//   email: string;
//   fullname:string;
//   name?: string; // Computed from firstName + lastName
//   role: string;
//   phoneNumber?: string;
// }

// export interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   forgotPassword: (email: string) => Promise<void>;
//   resetPassword: (token: string, newPassword: string) => Promise<void>;
//   loading: boolean;
//   error: string | null;
//   checkAuth: () => Promise<boolean>;
// }

// // Create the context with undefined as default value
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Check authentication status on app start and page refresh
//   useEffect(() => {
//     checkAuth();
//   }, []);

// // In your AuthContext.tsx - replace the checkAuth method
// const checkAuth = async (): Promise<boolean> => {
//   try {
//     setLoading(true);
//     const token = sessionStorage.getItem('token') || localStorage.getItem('token');
//     const savedUser = sessionStorage.getItem('user') || localStorage.getItem('user');
    
//     console.log('🔄 Checking auth status:', { 
//       hasToken: !!token, 
//       tokenLength: token?.length,
//       tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
//       hasSavedUser: !!savedUser 
//     });

//     // Check if token exists and is valid (not "null" string)
//     if (!token || token === 'null' || token === 'undefined') {
//       console.log('❌ No valid token found');
//       clearAuthData();
//       return false;
//     }

//     // If we have both token and saved user, restore immediately
//     if (savedUser && savedUser !== 'null') {
//       try {
//         const parsedUser = JSON.parse(savedUser);
//         setUser(parsedUser);
//         console.log('✅ Restored user from storage:', parsedUser.email);
//         return true;
//       } catch (err) {
//         console.error('❌ Failed to parse saved user:', err);
//         clearAuthData();
//         return false;
//       }
//     }

//     // If we have token but no saved user, verify the token and get user data
//     console.log('🔐 Verifying token and fetching user data...');
    
//     try {
//       // First verify the token is valid
//       const verifyResponse = await apiService.verifyToken();
//       console.log('✅ Token verified:', verifyResponse);
      
//       // Then get current user data
//       const currentUserResponse = await apiService.getCurrentUser();
//       console.log('✅ User data fetched:', currentUserResponse);
      
//       if (currentUserResponse.success && currentUserResponse.data) {
//         const userDataFromBackend = currentUserResponse.data.user || currentUserResponse.data;
//         const userData: User = {
//           id: userDataFromBackend.id,
//           email: userDataFromBackend.email,
//           fullname: userDataFromBackend.fullname || userDataFromBackend.name || '',
//           name: userDataFromBackend.name,
//           role: userDataFromBackend.role,
//           phoneNumber: userDataFromBackend.phoneNumber || userDataFromBackend.contact
//         };
        
//         setUser(userData);
        
//         // Update storage with fresh user data
//         sessionStorage.setItem('user', JSON.stringify(userData));
//         localStorage.setItem('user', JSON.stringify(userData));
        
//         console.log('✅ User authenticated successfully:', userData.email);
//         return true;
//       } else {
//         throw new Error('Failed to get user data from response');
//       }
//     } catch (userError: any) {
//       console.error('❌ Failed to verify token or get user data:', userError);
      
//       // If token is invalid, clear auth data
//       if (userError.message?.includes('401') || userError.message?.includes('Invalid token')) {
//         console.log('❌ Token invalid - clearing auth data');
//         clearAuthData();
//         return false;
//       }
      
//       // For other errors, keep the token but don't set user
//       console.log('⚠️ Token might be valid but user data fetch failed');
//       return false;
//     }
//   } catch (err) {
//     console.error('❌ Auth check failed:', err);
//     clearAuthData();
//     return false;
//   } finally {
//     setLoading(false);
//   }
// };

// // Add more specific error handling in login method
// const login = async (email: string, password: string) => {
//   try {
//     setLoading(true);
//     setError(null);
    
//     console.log('🔐 [AUTH-1] Starting login in AuthContext for:', email);
    
//     // Clear any existing auth data first
//     clearAuthData();
    
//     console.log('🔐 [AUTH-2] Calling apiService.login...');
//     const response = await apiService.login(email, password);
//     console.log('🔐 [AUTH-3] API service response received:', response);
    
//     // Enhanced token extraction with validation
//     const token = response.token || response.accessToken || response.data?.token;
    
//     if (!token || token === 'null' || token === 'undefined') {
//       console.error('🔐 [AUTH-ERROR] Invalid token received:', token);
//       throw new Error('Invalid authentication token received from server');
//     }

//     // Enhanced user data extraction
//     const userDataFromBackend = response.user || response.data?.user || response.data;
    
//     if (!userDataFromBackend || !userDataFromBackend.id || !userDataFromBackend.email) {
//       console.error('🔐 [AUTH-ERROR] Incomplete user data:', userDataFromBackend);
//       throw new Error('Incomplete user data received from server');
//     }

//     // Create normalized user object
//     const userData: User = {
//       id: userDataFromBackend.id.toString(),
//       email: userDataFromBackend.email,
//       fullname: userDataFromBackend.fullname || userDataFromBackend.name || email.split('@')[0],
//       name: userDataFromBackend.name || userDataFromBackend.fullname || email.split('@')[0],
//       role: userDataFromBackend.role || 'user',
//       phoneNumber: userDataFromBackend.phoneNumber || userDataFromBackend.contact || ''
//     };

//     console.log('🔐 [AUTH-8] Created user object:', userData);

//     // Store with validation
//     try {
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       localStorage.setItem('user', JSON.stringify(userData));
//       sessionStorage.setItem('token', token);
//       localStorage.setItem('token', token);
//     } catch (storageError) {
//       console.error('🔐 [AUTH-ERROR] Storage failed:', storageError);
//       throw new Error('Failed to save authentication data');
//     }

//     // Verify storage
//     const storedToken = localStorage.getItem('token');
//     if (storedToken !== token) {
//       throw new Error('Token storage verification failed');
//     }

//     setUser(userData);
//     console.log('🔐 [AUTH-11] Login completed successfully for:', userData.email);

//   } catch (err: any) {
//     // Clear auth data on any error
//     clearAuthData();
    
//     const errorMessage = err instanceof Error ? err.message : 'Login failed';
//     setError(errorMessage);
//     console.error('🔐 [AUTH-ERROR] Login failed:', errorMessage);
//     throw err;
//   } finally {
//     setLoading(false);
//   }
// };


// const register = async (name: string, email: string, password: string) => {
//   try {
//     setLoading(true);
//     setError(null);
    
//     console.log('👤 Registering user:', { name, email });
    
//     // Validate input
//     if (!name.trim() || !email.trim() || !password) {
//       throw new Error('All fields are required');
//     }

//     if (password.length < 6) {
//       throw new Error('Password must be at least 6 characters long');
//     }

//     // Register the user
//     const response = await apiService.register({
//       name: name.trim(),
//       email: email.trim(),
//       password
//     });
    
//     console.log('✅ Registration response:', response);

//     // Check for different success indicators
//     if (response.success || response.message?.includes('success') || response.data) {
//       console.log('✅ Registration successful, attempting login...');
      
//       // Auto-login after successful registration
//       await login(email, password);
//     } else {
//       throw new Error(response.message || 'Registration failed');
//     }
    
//   } catch (err: any) {
//     const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
//     setError(errorMessage);
//     console.error('❌ Registration error:', errorMessage);
    
//     // Clear any partial auth data
//     clearAuthData();
//     throw err;
//   } finally {
//     setLoading(false);
//   }
// };

//   const logout = () => {
//     console.log('🚪 Logging out user:', user?.email);
//     clearAuthData();
//   };

//   const clearAuthData = () => {
//     setUser(null);
//     setError(null);
    
//     // Clear from both storages
//     sessionStorage.removeItem('user');
//     sessionStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
    
//     console.log('🧹 Cleared all auth data from storage');
//   };

//   const forgotPassword = async (email: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await apiService.forgotPassword(email);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to process password reset request.';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetPassword = async (token: string, newPassword: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await apiService.resetPassword(token, newPassword);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to reset password.';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated: !!user,
//     login,
//     logout,
//     register,
//     forgotPassword,
//     resetPassword,
//     loading,
//     error,
//     checkAuth
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Export the context itself if needed for direct consumption
// export { AuthContext };

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
      
      console.log('🔄 Checking auth status:', { 
        hasToken: !!token, 
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        hasSavedUser: !!savedUser 
      });

      if (!token || token === 'null' || token === 'undefined') {
        console.log('❌ No valid token found');
        clearAuthData();
        return false;
      }

      if (savedUser && savedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log('✅ Restored user from storage:', parsedUser.email);
          return true;
        } catch (err) {
          console.error('❌ Failed to parse saved user:', err);
          clearAuthData();
          return false;
        }
      }

      console.log('🔐 Verifying token and fetching user data...');
      
      try {
        const verifyResponse = await apiService.verifyToken();
        console.log('✅ Token verified:', verifyResponse);
        
        const currentUserResponse = await apiService.getCurrentUser();
        console.log('✅ User data fetched:', currentUserResponse);
        
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
          
          console.log('✅ User authenticated successfully:', userData.email);
          return true;
        } else {
          throw new Error('Failed to get user data from response');
        }
      } catch (userError: any) {
        console.error('❌ Failed to verify token or get user data:', userError);
        
        if (userError.message?.includes('401') || userError.message?.includes('Invalid token')) {
          console.log('❌ Token invalid - clearing auth data');
          clearAuthData();
          return false;
        }
        
        console.log('⚠️ Token might be valid but user data fetch failed');
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
      
      console.log('🔐 [AUTH-1] Starting login in AuthContext for:', email);
      clearAuthData();
      
      console.log('🔐 [AUTH-2] Calling apiService.login...');
      const response = await apiService.login(email, password);
      console.log('🔐 [AUTH-3] API service response received:', response);
      
      const token = response.token || response.accessToken || response.data?.token;
      console.log('🔐 [AUTH-4] Extracted token:', {
        exists: !!token,
        length: token?.length,
        preview: token ? `${token.substring(0, 10)}...` : 'none'
      });

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

      console.log('🔐 [AUTH-8] Created user object:', userData);

      sessionStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
      localStorage.setItem('token', token);

      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      console.log('🔐 [AUTH-10] Storage verification:', {
        tokenStored: storedToken === token,
        tokenLength: storedToken?.length,
        userStored: !!storedUser
      });

      setUser(userData);
      console.log('🔐 [AUTH-11] Login completed successfully for:', userData.email);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('🔐 [AUTH-ERROR] Login failed:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
      
      console.log('✅ Registration response:', response);

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
    console.log('🚪 Logging out user:', user?.email);
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
    
    console.log('🧹 Cleared all auth data from storage');
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
          console.log('🔐 Token expired, auto-logout');
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