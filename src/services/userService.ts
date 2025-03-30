
import { User, UserCredentials, UserRole } from "@/types/auth";

// Storage key for the user database
const USERS_STORAGE_KEY = 'app_users_database';

/**
 * Get all users from local storage
 */
export const getStoredUsers = (): Record<string, UserCredentials> => {
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

/**
 * Save a new user to the database
 */
export const saveUserToDatabase = (
  email: string, 
  password: string, 
  role: UserRole, 
  name?: string
): User => {
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

/**
 * Get a stored user by email and password
 */
export const getUserByCredentials = (email: string, password: string): User | null => {
  const users = getStoredUsers();
  const userRecord = users[email];
  
  if (!userRecord || userRecord.password !== password) {
    return null;
  }
  
  return {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role,
  };
};

/**
 * Save the current user to localStorage for session persistence
 */
export const saveUserSession = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Get the current user from localStorage
 */
export const getUserSession = (): User | null => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    return JSON.parse(savedUser);
  }
  return null;
};

/**
 * Clear the user session from localStorage
 */
export const clearUserSession = (): void => {
  localStorage.removeItem('user');
};
