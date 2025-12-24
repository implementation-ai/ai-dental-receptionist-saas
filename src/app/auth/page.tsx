'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Phone, Mail, Building, Users, TrendingUp, CheckCircle } from 'lucide-react'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clinicName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    plan: 'basic'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    const setUserMessage = (msg: string) => {
      // Mostrar un mensaje sencillo al usuario; en un futuro puede usarse un componente Toast
      alert(msg)
    }
    
    if (isLogin) {
      // Lógica de login
      try {
        const response = await fetch('/api/auth/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (response.ok) {
          console.log('Login successful')
          // Redirigir al dashboard
          window.location.href = '/dashboard'
        } else {
          const contentType = response.headers.get('content-type') || ''
          let errMsg = 'Login failed'
          try {
            if (contentType.includes('application/json')) {
              const json = await response.json()
              errMsg = json?.error || json?.message || errMsg
            } else {
              errMsg = await response.text()
            }
          } catch {
            // ignore
          }
          console.error('Login failed:', errMsg)
          setUserMessage(errMsg)
        }
      } catch (error) {
        console.error('Login error:', error)
        setUserMessage('Error de conexión al servidor. Intenta de nuevo más tarde.')
      }
    } else {
      // Lógica de registro
      try {
        const response = await fetch('/api/auth/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        if (response.ok) {
          console.log('Registration successful')
          // Mostrar mensaje de éxito
          alert('¡Registro exitoso! Te contactaremos pronto.')
          setIsLogin(true)
        } else {
          const contentType = response.headers.get('content-type') || ''
          let errMsg = 'Registration failed'
          try {
            if (contentType.includes('application/json')) {
              const json = await response.json()
              errMsg = json?.error || json?.message || errMsg
            } else {
              errMsg = await response.text()
            }
          } catch {
            // ignore
          }
          console.error('Registration failed:', errMsg)
          setUserMessage(errMsg)
        }
      } catch (error) {
        console.error('Registration error:', error)
        setUserMessage('No se pudo conectar con el servidor. Verifica la conexión e intenta nuevamente.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🦷 AI Dental Receptionist
          </h1>
          <p className="text-gray-600">
            Captura el 100% de tus llamadas 24/7
          </p>
        </div>

        <Card>
          <Tabs value={isLogin ? 'login' : 'register'} className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="•••••••••"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Iniciar Sesión
                </Button>
              </form>
              </TabsContent>

              <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Nombre de la Clínica</Label>
                  <Input
                    id="clinicName"
                    value={formData.clinicName}
                    onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
                    placeholder="Clínica Dental Madrid"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName">Nombre del Contacto</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Dr. Juan Pérez"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email de Contacto</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="juan@clinicadental.es"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Teléfono de Contacto</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+34 600 123 456"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plan">Plan Deseado</Label>
                  <select
                    id="plan"
                    value={formData.plan}
                    onChange={(e) => setFormData(prev => ({ ...prev, plan: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="basic">Básico - €199/mes</option>
                    <option value="pro">Profesional - €499/mes</option>
                    <option value="enterprise">Empresarial - €1,299/mes</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Solicitar Demo
                </Button>
              </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Features */}
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                100% Captura de Llamadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Nunca más pierdas una llamada. Nuestra IA atiende 24/7, cualifica pacientes y agenda citas automáticamente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                ROI Garantizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Recupera tu inversión en 3-4 días. Promedio de 300-500% ROI en 12 meses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Multi-tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Gestiona múltiples clínicas desde un solo panel. Cada una con su configuración independiente.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                Integraciones Listas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Google Calendar, Twilio, SMS/Email, y más. Configuración en minutos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}