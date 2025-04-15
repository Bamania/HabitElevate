'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { Store, AppStore } from '../lib/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = Store // ✅ Corrected: Directly assign Store
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
