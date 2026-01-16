'use client'

import { Provider } from 'react-redux'
import store from './index'

interface AdminProviderProps {
  children: React.ReactNode
}

export default function AdminProvider({ children }: AdminProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
