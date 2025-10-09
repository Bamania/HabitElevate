'use client'

import { useAuth } from '../../providers/AuthProvider'

export function UserProfile() {
  const { user } = useAuth()

  if (!user) return null

  const userEmail = user.email || 'No email'
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0]
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-muted-foreground">{userEmail}</p>
      </div>
      {userAvatar ? (
        <img 
          src={userAvatar} 
          alt={userName}
          className="h-10 w-10 rounded-full"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-semibold">
          {userName.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}
