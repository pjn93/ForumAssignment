'use client'

import { Toaster } from 'react-hot-toast'
import { store } from './redux/store' // adjust the import path to your store
import { Provider } from 'react-redux'

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
     <Toaster position="bottom-left" toastOptions={{ duration: 5000 }} />{children}</Provider>
}