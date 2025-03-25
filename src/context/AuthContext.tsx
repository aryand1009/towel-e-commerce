
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'customer' | 'admin' | null;

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (email: string, name: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

// Our "database" - in a real app, this would be a real database
// For this demo, we're using localStorage as our "database"
const USERS_STORAGE_KEY = 'app_users_database';

// Helper function to get users from our "database"
const getStoredUsers = (): Record<string, { id: string, email: string, password: string, name?: string, role: UserRole }> => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Initialize with admin account
  const initialUsers = {
    'admin@dtex.com': {
      id: 'admin-1',
      email: 'admin@dtex.com',
      password: 'admin123',
      role: 'admin' as UserRole
    }
  };
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

// Helper function to save a user to our "database"
const saveUserToDatabase = (
  email: string, 
  password: string, 
  role: UserRole, 
  name?: string
): { id: string, email: string, role: UserRole, name?: string } => {
  const users = getStoredUsers();
  
  // Create user entry
  const userId = `user-${Math.random().toString(36).substring(2)}`;
  users[email] = {
    id: userId,
    email,
    password, // In a real app, this would be hashed!
    role,
    ...(name ? { name } : {})
  };
  
  // Save updated users
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // Return user data (without password)
  return {
    id: userId,
    email,
    role,
    ...(name ? { name } : {})
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing user session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function - now checks against our "database"
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email || !password) {
        return false;
      }

      // Get users from database
      const users = getStoredUsers();
      
      // Check if user exists and password matches
      const userRecord = users[email];
      if (!userRecord || userRecord.password !== password) {
        return false;
      }
      
      // Verify role if provided (for extra security)
      if (role && userRecord.role !== role) {
        return false;
      }

      // Create user object (without password)
      const loggedInUser: User = {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
      };

      // Save to state and localStorage for session
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Signup function - now stores in our "database"
  const signup = async (email: string, name: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email || !password || !name) {
        return false;
      }

      // Check if user already exists
      const users = getStoredUsers();
      if (users[email]) {
        // User already exists
        return false;
      }

      // Save user to database
      const newUser = saveUserToDatabase(email, password, role, name);

      // Save to state and localStorage for session
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,
      login, 
      signup,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
