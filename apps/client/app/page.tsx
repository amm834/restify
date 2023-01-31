'use client'
import { useUser } from "./hooks/useUser"

export default function Home() {
  const { user } = useUser()
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1>Hello, <span className="font-bold">{user.name}</span></h1>
      </div>
    )
  }
  return (
    <main className="flex items-center justify-center min-h-screen">
      Please Login
    </main>
  )
}
