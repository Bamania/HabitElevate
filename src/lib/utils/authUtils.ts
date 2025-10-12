/**
 * User Authentication Utilities
 * 
 * Helper functions for working with authenticated users and their IDs
 */

import { User } from '@supabase/supabase-js';

/**
 * Check if a user is authenticated
 */
export const isAuthenticated = (user: User | null): boolean => {
  return user !== null && user.id !== undefined;
};

/**
 * Get user ID safely with validation
 * @throws Error if user is not authenticated
 */
export const getUserId = (user: User | null): string => {
  if (!user?.id) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

/**
 * Get user ID or null if not authenticated
 */
export const getUserIdOrNull = (user: User | null): string | null => {
  return user?.id || null;
};

/**
 * Validate user is authenticated before performing action
 * Returns true if authenticated, false otherwise
 */
export const requireAuth = (user: User | null, errorMessage?: string): boolean => {
  if (!user?.id) {
    if (errorMessage) {
      console.error(errorMessage);
    }
    return false;
  }
  return true;
};

/**
 * Get user email safely
 */
export const getUserEmail = (user: User | null): string | null => {
  return user?.email || null;
};

/**
 * Format user display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Guest';
  return user.email?.split('@')[0] || user.id.substring(0, 8);
};

/**
 * Example usage in components:
 * 
 * import { useAuth } from '@/providers/AuthProvider';
 * import { getUserId, requireAuth } from '@/lib/utils/authUtils';
 * 
 * function MyComponent() {
 *   const { user } = useAuth();
 * 
 *   const handleAction = async () => {
 *     if (!requireAuth(user, 'Must be logged in')) {
 *       return;
 *     }
 *     
 *     const userId = getUserId(user);
 *     await todoApiService.createTodo({ text: 'Task', user_id: userId });
 *   };
 * }
 */
