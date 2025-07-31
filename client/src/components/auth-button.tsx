import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle, signOutUser } from '@/lib/auth';
import { isFirebaseConfigured } from '@/lib/firebase';

export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        กำลังโหลด...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
          <span className="hidden sm:inline">{user.displayName || user.email}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={signOutUser}
          className="text-red-600 hover:text-red-700"
        >
          <LogOut className="w-4 h-4 mr-1" />
          ออกจากระบบ
        </Button>
      </div>
    );
  }

  // If Firebase is not configured, don't show the auth button
  if (!isFirebaseConfigured()) {
    return null;
  }

  return (
    <Button 
      variant="default" 
      size="sm"
      onClick={signInWithGoogle}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <LogIn className="w-4 h-4 mr-2" />
      เข้าสู่ระบบด้วย Google
    </Button>
  );
}