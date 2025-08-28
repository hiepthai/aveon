import type { User } from '@supabase/supabase-js';
import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { LoadingSpinner } from '~/components/loading-spinner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes on the client side
    if (typeof window !== 'undefined') {
      // This would be implemented when we have client-side Supabase instance
      // For now, we'll rely on the server-side user data
      setLoading(false);
    }
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      // Redirect to logout route which handles server-side sign out
      navigate('/logout');
    } catch (error) {
      console.error('Sign out error:', error);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user is authenticated
export function useRequireAuthenticated(): User | null {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  return user;
}

// Hook to check if user is unauthenticated
export function useRequireUnauthenticated(): User | null {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return user;
}

// Component to protect routes that require authentication
interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps): ReactElement {
  const user = useRequireAuthenticated();

  if (!user) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  return <>{children}</>;
}

// Component to protect routes that do not require authentication
interface UnprotectedRouteProps {
  children: ReactNode;
}

export function UnprotectedRoute({
  children,
}: UnprotectedRouteProps): ReactElement {
  const user = useRequireUnauthenticated();

  if (user) {
    return <LoadingSpinner message="Redirecting to homepage..." />;
  }

  return <>{children}</>;
}
