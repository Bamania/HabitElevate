import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import fetch from 'node-fetch'

// Server-side endpoint that revokes a user's refresh tokens using the Supabase service role key.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const access_token = body?.access_token

    if (!access_token) {
      return NextResponse.json({ error: 'missing access_token' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'server not configured' }, { status: 500 })
    }

    // Call Supabase Auth Admin API to revoke refresh tokens for a user by passing their JWT
    const resp = await fetch(`${supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
      },
      body: JSON.stringify({ token: access_token }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.error('Failed to revoke token:', resp.status, text)
      return NextResponse.json({ error: 'failed to revoke token' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('signout error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
