'use client'

import { useAuth } from '../../providers/AuthProvider'

export function UserProfile() {
  const { user } = useAuth()

  if (!user) return null

  const userEmail = user.email || 'No email'
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || userEmail.split('@')[0]
  const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const userPhone = user.phone || 'No phone'

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-end">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-muted-foreground">{userEmail}</p>
        <p className="text-xs text-muted-foreground">{userPhone}</p>
        <p className="text-xs text-muted-foreground">ID: {user.id}</p>
        <p className="text-xs text-muted-foreground">Created At: {user.created_at}</p>
        <p className="text-xs text-muted-foreground">Updated At: {user.updated_at}</p>
        <p className="text-xs text-muted-foreground">Last Login: {user.last_sign_in_at}</p>
        <p className="text-xs text-muted-foreground">Phone: {user.phone}</p>
        <p className="text-xs text-muted-foreground">Email: {user.email}</p>
        <p className="text-xs text-muted-foreground">Name: {user.user_metadata?.full_name}</p>
        <p className="text-xs text-muted-foreground">Avatar: {user.user_metadata?.avatar_url}</p>
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
