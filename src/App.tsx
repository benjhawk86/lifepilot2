import { useState } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Login } from '@/components/login'
import { Dashboard } from '@/components/dashboard'
import { Workouts } from '@/components/workouts'
import { AdminPanel } from '@/components/admin-panel'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { House, Barbell, Gear, SignOut, User } from '@phosphor-icons/react'

function AppContent() {
  const { user, logout, isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'admin'>('dashboard')

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">LifePilot</h1>
              <div className="hidden md:flex gap-2">
                <Button
                  variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('dashboard')}
                >
                  <House className="mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'workouts' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPage('workouts')}
                >
                  <Barbell className="mr-2" />
                  Workouts
                </Button>
                {user?.role === 'admin' && (
                  <Button
                    variant={currentPage === 'admin' ? 'default' : 'ghost'}
                    onClick={() => setCurrentPage('admin')}
                  >
                    <Gear className="mr-2" />
                    Admin
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User weight="duotone" />
                <span className="font-medium">{user?.email}</span>
                {user?.role === 'admin' && (
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-md font-medium">
                    ADMIN
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <SignOut className="mr-2" />
                Logout
              </Button>
            </div>
          </div>

          <div className="flex md:hidden gap-2 mt-4">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('dashboard')}
              className="flex-1"
              size="sm"
            >
              <House />
            </Button>
            <Button
              variant={currentPage === 'workouts' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('workouts')}
              className="flex-1"
              size="sm"
            >
              <Barbell />
            </Button>
            {user?.role === 'admin' && (
              <Button
                variant={currentPage === 'admin' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('admin')}
                className="flex-1"
                size="sm"
              >
                <Gear />
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'workouts' && <Workouts />}
        {currentPage === 'admin' && user?.role === 'admin' && <AdminPanel />}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}

export default App