'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Phone, Calendar, Users, TrendingUp, CheckCircle, ArrowRight, CheckCircle2, Bot, Star, BarChart3, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function LandingPage() {
  const { toast } = useToast()
  const [isLogin, setIsLogin] = useState(false)
  const [formData, setFormData] = useState({
    clinicName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  // Scroll to registration section
  const scrollToRegistration = () => {
    const section = document.getElementById('registration-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      setIsLogin(false) // Ensure we show registration tab
    }
  }

  // Handle demo request
  const handleRequestDemo = () => {
    toast({
      title: "Solicitud recibida",
      description: "Un especialista se pondrá en contacto contigo en breve para agendar tu demo personalizada.",
      duration: 5000,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Procesando registro...",
      description: "Conectando con nuestro recepcionista IA...",
      duration: 3000,
    })

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Registro desde landing page`,
          clinicName: formData.clinicName
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "¡Registro Exitoso!",
          description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
          duration: 8000,
          className: "bg-green-50 border-green-200"
        })
        // Reset form
        setFormData({
          clinicName: '',
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        })
      } else {
        throw new Error(result.error || 'Error en el registro')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error en el registro",
        description: "Hubo un problema al conectar con el servidor. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login:', formData)

    toast({
      title: "Sesión iniciada",
      description: "Redirigiendo al dashboard...",
      duration: 3000,
    })

    // Simulate redirect delay
    setTimeout(() => {
      // In a real app, uses router.push('/dashboard')
      console.log('Redirecting to dashboard...')
    }, 1500)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* Navigation moved to layout */}

      {/* Discovery / Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                Atención 24/7 sin pausas ni festivos
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                Tu Clínica Dental Nunca Más Perderá una Llamada
              </h1>
              <p className="text-lg text-gray-600 md:text-xl leading-relaxed">
                El sistema de <strong className="font-semibold text-blue-700">recepción virtual con IA</strong> que captura el 100% de tus pacientes, cualifica urgencias, agenda citas en Google Calendar y dispara tu facturación.
              </p>

              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Aumenta tu tasa de respuesta al <strong>85-99%</strong>.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Ahorra +15h/semana a tu equipo de recepción.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>ROI estimado del <strong>300%</strong> en 3 meses.</span>
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <div className="w-full max-w-sm space-y-2">
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-lg shadow-xl shadow-blue-100"
                    onClick={scrollToRegistration}
                  >
                    Prueba Gratis 14 Días
                  </Button>
                  <p className="text-xs text-center text-gray-500">Sin tarjeta de crédito · Cancela cuando quieras</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none hidden md:block">
              <div className="relative rounded-2xl bg-white p-2 shadow-2xl border border-gray-100">
                <div className="rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                  <div className="bg-white p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bot className="h-8 w-8 text-blue-600 p-1 bg-blue-100 rounded-lg" />
                      <div>
                        <p className="font-semibold text-sm">Asistente Dental IA</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <span className="block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          En línea ahora
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Llamada en curso...</Badge>
                  </div>
                  <div className="p-6 space-y-4 font-mono text-sm leading-relaxed">
                    <div className="p-3 bg-white rounded-lg shadow-sm w-3/4 border border-gray-100">
                      <span className="text-xs text-gray-400 block mb-1">Paciente</span>
                      "Hola, quisiera pedir cita para una limpieza dental la próxima semana, preferiblemente por la tarde."
                    </div>
                    <div className="p-3 bg-blue-600 text-white rounded-lg shadow-sm w-3/4 ml-auto">
                      <span className="text-xs text-blue-200 block mb-1">IA Receptionist</span>
                      "¡Claro! Tengo un hueco libre el martes 24 a las 17:00 o el jueves 26 a las 16:30. ¿Cuál prefieres?"
                    </div>
                    <div className="p-3 bg-white rounded-lg shadow-sm w-3/4 border border-gray-100">
                      <span className="text-xs text-gray-400 block mb-1">Paciente</span>
                      "El martes a las 17:00 está perfecto."
                    </div>
                    <div className="flex justify-center py-2">
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 gap-1 px-3 py-1">
                        <Calendar className="h-3 w-3 inline mr-1" /> Cita Agendada: Google Calendar
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Badges */}
              <div className="absolute -left-8 top-1/2 animate-bounce bg-white p-3 rounded-lg shadow-xl border border-gray-100 hidden lg:block">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <div>
                    <p className="text-xs font-semibold">Valoración 4.9/5</p>
                    <p className="text-[10px] text-gray-500">Más de 50 clínicas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para automatizar tu recepción
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tecnología diseñada específicamente para las necesidades de una clínica dental moderna.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-blue-50/50">
              <CardHeader>
                <Phone className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Recepción IA 24/7</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Responde todas las llamadas al instante, sin esperas, incluso fines de semana y festivos. Nunca más comuniques.
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-green-50/50">
              <CardHeader>
                <Calendar className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Agendado Automático</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Se integra directamente con tu <strong>Google Calendar</strong>. Consulta disponibilidad en tiempo real y cierra la cita sin intervención humana.
              </CardContent>
            </Card>

            <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-purple-50/50">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Dashboard de Métricas</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Visualiza tu ROI en tiempo real. Controla llamadas perdidas, recuperadas, nuevos pacientes y facturación estimada.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits / Stats Section */}
      <section id="benefits" className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resultados que Transforman Clínicas</h2>
            <p className="text-lg text-gray-600">Datos reales promedios de nuestros clientes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-lg font-medium text-gray-900 mb-1">Tasa de Respuesta</div>
              <div className="text-gray-600">vs 20-30% tradicional</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-green-600 mb-2">300%</div>
              <div className="text-lg font-medium text-gray-900 mb-1">ROI Promedio</div>
              <div className="text-gray-600">recuperación en 3-4 meses</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-4xl font-bold text-purple-600 mb-2">15h</div>
              <div className="text-lg font-medium text-gray-900 mb-1">Tiempo Ahorrado</div>
              <div className="text-gray-600">por semana por recepcionista</div>
            </div>
          </div>
        </div>
      </section>


      {/* Registration Section (Acting as Pricing/Get Started) */}
      <section id="registration-section" className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-50/30 -z-10" />
        <div className="max-w-md mx-auto">
          <Tabs
            value={isLogin ? "login" : "register"}
            onValueChange={(val) => setIsLogin(val === 'login')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="register">Nueva Clínica</TabsTrigger>
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            </TabsList>

            <TabsContent value="register">
              <Card className="shadow-2xl border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
                  <p className="text-sm text-gray-600">
                    Comienza tu prueba gratuita de 14 días
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clinicName">Nombre de la Clínica</Label>
                        <Input
                          id="clinicName"
                          type="text"
                          value={formData.clinicName}
                          onChange={(e) => handleInputChange('clinicName', e.target.value)}
                          placeholder="Clínica Dental Madrid"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="name">Tu Nombre Completo</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Dr. Juan Pérez"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email Profesional</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="juan.perez@clinicadental.es"
                          required
                          className="mt-1"
                        />
                      </div>

                      {/* Hidden fields for simplified MVP submission */}
                      <input type="hidden" name="phone" value={formData.phone} />
                    </div>

                    <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-11 text-lg">
                      Crear Cuenta Gratuita
                    </Button>

                    <div className="text-center text-xs text-gray-500 mt-4">
                      Al crear tu cuenta, aceptas nuestros <a href="#" className="underline">términos y condiciones</a>.
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="login">
              <Card className="shadow-2xl border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
                  <p className="text-sm text-gray-600">
                    Accede a tu cuenta de AI Dental Receptionist
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="tu@email.com"
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="login-password">Contraseña</Label>
                          <Button variant="link" className="px-0 h-auto text-xs text-blue-600" tabIndex={-1}>
                            ¿Olvidaste tu contraseña?
                          </Button>
                        </div>
                        <Input
                          id="login-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Tu contraseña"
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 h-11">
                      Iniciar Sesión
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer moved to layout */}
    </div>
  )
}