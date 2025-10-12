'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import { createSupabaseClient } from '../../lib/supabase/client';
import { Phone, ArrowRight, Loader2 } from 'lucide-react';

export default function PhoneSetupPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkExistingPhone = async () => {
      if (!user?.id) {
        setChecking(false);
        return;
      }

      try {
        const supabase = createSupabaseClient();
        
        // Check if user already has a phone number in users_profile
        const { data, error } = await supabase
          .from('users_profile')
          .select('phone')
          .eq('id', user.id)
          .maybeSingle();

        // Ignore "no rows" error - it's expected for new users
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking phone:', error);
          setChecking(false);
          return;
        }

        if (data?.phone) {
          // Phone already exists, redirect to home
          console.log('Phone already set, redirecting to home');
          router.push('/');
          return;
        }

        setChecking(false);
      } catch (err) {
        console.error('Error checking phone:', err);
        setChecking(false);
      }
    };

    if (!authLoading) {
      checkExistingPhone();
    }
  }, [user?.id, authLoading, router]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as international or local number
    if (cleaned.startsWith('1') && cleaned.length <= 11) {
      // US number: +1 (XXX) XXX-XXXX
      const match = cleaned.match(/^1?(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (match) {
        return [
          match[1] ? `+1 (${match[1]}` : '+1',
          match[2] ? `) ${match[2]}` : '',
          match[3] ? `-${match[3]}` : ''
        ].join('');
      }
    }
    
    // International number: +XX XXXXXXXXXX
    if (cleaned.length > 0) {
      const countryCode = cleaned.slice(0, 2);
      const rest = cleaned.slice(2);
      return `+${countryCode} ${rest}`;
    }
    
    return value;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all formatting
    const cleaned = phone.replace(/\D/g, '');
    
    // Must be between 10-15 digits
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number (10-15 digits)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createSupabaseClient();
      
      // Clean phone number - keep only digits and leading +
      let cleanedPhone = phoneNumber.replace(/[^\d+]/g, '');
      
      // Ensure phone starts with + for country code
      if (!cleanedPhone.startsWith('+')) {
        // Default to +1 (US) if no country code provided
        cleanedPhone = '+1' + cleanedPhone;
      }
      
      console.log('Attempting to upsert user profile:', {
        id: user.id,
        phone: cleanedPhone,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      });
      
      // Upsert user profile with phone number and required fields
      const { data, error: upsertError } = await supabase
        .from('users_profile')
        .upsert({
          id: user.id,
          phone: cleanedPhone,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          currenthabits: '',  // Provide default empty string for NOT NULL column
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select();

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw upsertError;
      }

      console.log('Upsert successful:', data);
      
      // Success! Redirect to home
      console.log('Phone number saved successfully:', cleanedPhone);
      router.push('/');
      router.refresh();
      
    } catch (err: any) {
      console.error('Error saving phone number:', err);
      setError(err.message || 'Failed to save phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // For now, we'll require phone number
    // If you want to allow skipping, uncomment below:
    // router.push('/');
    setError('Phone number is required to use the AI agent features');
  };

  // Show loading while checking authentication and existing phone
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            One More Step!
          </h1>
          <p className="text-gray-600">
            Please provide your phone number to enable AI agent features and voice reminders
          </p>
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-gray-800">{user.email}</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="+1 5551234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                required
                disabled={loading}
              />
              <Phone className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Include country code with + (e.g., +1 for US, +91 for India). If no country code is provided, +1 will be added automatically.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Optional: Allow skip (currently disabled) */}
            {/* <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              Skip for now
            </button> */}
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Why we need this:
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Voice call reminders for your habits</li>
            <li>• AI agent can contact you for check-ins</li>
            <li>• Personalized notifications and updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
