import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Barbell } from '@phosphor-icons/react'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

export function Login() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLogin = async (e: React.FormEvent, isAdmin = false) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(loginData.email, loginData.password, isAdmin)
      toast.success(`Welcome ${isAdmin ? 'Admin' : 'back'}!`)
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await login(registerData.email, registerData.password)
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary rounded-2xl">
              <Barbell size={48} weight="duotone" className="text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">LifePilot</h1>
          <p className="text-muted-foreground mt-2">AI-Enhanced Fitness Tracking</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="p-6">
              <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={(e) => handleLogin(e, true)}
                  disabled={isLoading}
                >
                  Login as Admin
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            <strong>Disclaimer:</strong> AI-generated fitness and nutrition plans are for informational purposes only and
            do not constitute medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}
