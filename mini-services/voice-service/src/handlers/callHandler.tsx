import { Socket } from 'socket.io'
import { ZAI } from 'z-ai-web-dev-sdk'

interface CallSession {
  callId: string
  tenantId: string
  from: string
  to: string
  phase: 'greeting' | 'identification' | 'qualification' | 'scheduling' | 'confirmation' | 'farewell'
  patientInfo: {
    name?: string
    phone?: string
    email?: string
    isNewPatient?: boolean
  }
  appointmentInfo: {
    reason?: string
    urgency?: string
    urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency'
  }
  availableSlots: any[]
  selectedSlot?: any
  context: Record<string, any>
  createdAt: Date
}

// Cache de respuestas comunes por tipo de consulta
const COMMON_RESPONSES = {
  horarios: 'Nuestro horario de atención es de lunes a viernes de 09:00 a 20:00, y sábados de 09:00 a 14:00.',
  precios: 'Para información exacta de precios, te conectaremos con nuestro equipo. ¿Prefieres que te llamen?',
  ubicacion: 'Estamos en Madrid, en la calle Gran Vía 123. ¿Necesitas indicaciones para llegar?',
  servicios: 'Ofrecemos limpieza, revisiones, ortodoncia, blanqueamiento, implantes y tratamientos de urgencia.',
  cita_previa: 'Puedes cancelar o cambiar tu cita hasta 24 horas antes sin costo.',
  emergencia: 'Si tienes una emergencia dental fuera de horario, llama al +34 600 000 000 para atención inmediata.'
}

// Modelos de IA según complejidad y costo
const AI_MODELS = {
  fast: {
    name: 'gpt-3.5-turbo',
    maxTokens: 150,
    temperature: 0.7,
    description: 'Respuestas rápidas y directas'
  },
  balanced: {
    name: 'gpt-4',
    maxTokens: 300,
    temperature: 0.5,
    description: 'Respuestas equilibradas y precisas'
  },
  detailed: {
    name: 'gpt-4-turbo',
    maxTokens: 500,
    temperature: 0.3,
    description: 'Respuestas detalladas y cuidadosas'
  }
}

export class CallHandler {
  private activeCalls: Map<string, CallSession> = new Map()
  private zai: ZAI
  private responseCache: Map<string, { response: string, timestamp: number }> = new Map()

  constructor(private io: any) {
    this.zai = new ZAI()
  }

  async handleIncomingCall(req: any, res: any) {
    const { CallSid, From, To } = req.body
    
    try {
      // Identificar tenant y obtener configuración
      const tenantId = this.identifyTenantByPhone(To)
      const tenantConfig = await this.getTenantConfig(tenantId)
      
      // Crear sesión de llamada
      const session: CallSession = {
        callId: CallSid,
        tenantId,
        from: From,
        to: To,
        phase: 'greeting',
        patientInfo: {},
        appointmentInfo: {},
        availableSlots: [],
        context: { tenantConfig },
        createdAt: new Date()
      }
      
      this.activeCalls.set(CallSid, session)
      console.log(`📞 New call session created: ${CallSid}`)
      
      // Generar saludo personalizado
      const greetingResponse = await this.generatePersonalizedGreeting(tenantConfig)
      
      // Enviar respuesta de voz
      res.status(200).send('<Response><Say language="es">' + greetingResponse + '</Say></Response>')
    } catch (error) {
      console.error('Error handling incoming call:', error)
      res.status(500).send('Error')
    }
  }

  async processSpeechInput(socket: Socket, data: any) {
    const { callId, transcript, confidence } = data
    const session = this.activeCalls.get(callId)
    
    if (!session) return
    
    try {
      console.log(`🎤 Processing speech input for ${callId}: "${transcript}" (confidence: ${confidence})`)
      
      // Procesar según fase actual
      const response = await this.processByPhase(session, transcript)
      
      // Enviar respuesta de voz
      socket.emit('ai-response', {
        message: response.message,
        phase: response.nextPhase,
        data: response.data
      })
      
      // Actualizar sesión
      session.phase = response.nextPhase
      session.context = { ...session.context, ...response.data }
      
    } catch (error) {
      console.error('Error processing speech input:', error)
      socket.emit('ai-response', {
        message: 'Lo siento, no entendí. ¿Puedes repetir?',
        phase: session.phase
      })
    }
  }

  private async processByPhase(session: CallSession, input: string) {
    const { phase, context, tenantId } = session
    
    switch (phase) {
      case 'greeting':
        return await this.handleGreeting(session, input)
      
      case 'identification':
        return await this.handleIdentification(session, input)
      
      case 'qualification':
        return await this.handleQualification(session, input)
      
      case 'scheduling':
        return await this.handleScheduling(session, input)
      
      case 'confirmation':
        return await this.handleConfirmation(session, input)
      
      default:
        return await this.handleFallback(session, input)
    }
  }

  private async handleGreeting(session: CallSession, input: string) {
    // Verificar si es pregunta común primero
    const commonResponse = this.checkCommonQuestions(input)
    if (commonResponse) {
      return {
        message: commonResponse,
        nextPhase: 'greeting',
        data: { commonQuestion: true }
      }
    }
    
    // Extraer si es paciente nuevo o recurrente
    const isNewPatient = this.extractPatientType(input)
    session.patientInfo.isNewPatient = isNewPatient
    
    return {
      message: `¿Es usted paciente nuevo o ya nos ha visitado antes?`,
      nextPhase: 'identification',
      data: { patientTypeDetected: true }
    }
  }

  private async handleIdentification(session: CallSession, input: string) {
    const isNewPatient = input.toLowerCase().includes('nuevo') || 
                       input.toLowerCase().includes('primera vez') ||
                       input.toLowerCase().includes('nunca')
    
    session.patientInfo.isNewPatient = isNewPatient
    
    if (isNewPatient !== null) {
      return {
        message: `¡Bienvenido! Para ayudarte mejor, ¿cuál es el motivo de tu consulta? (limpieza, dolor, revisión, tratamiento específico)`,
        nextPhase: 'qualification',
        data: { isNewPatient }
      }
    }
    
    return {
      message: '¿Es usted paciente nuevo o ya nos ha visitado antes?',
      nextPhase: 'identification'
    }
  }

  private async handleQualification(session: CallSession, input: string) {
    // Extraer motivo y urgencia
    const { reason, urgencyLevel } = this.extractReasonAndUrgency(input)
    session.appointmentInfo.reason = reason
    session.appointmentInfo.urgencyLevel = urgencyLevel
    
    // Generar slots disponibles
    const slots = await this.generateAvailableSlots(session.tenantId, reason, urgencyLevel)
    session.availableSlots = slots
    
    const slotsText = slots.map((slot, index) => 
      `${index + 1}. ${slot.date} a las ${slot.time}`
    ).join('\n')
    
    return {
      message: `Tengo estas opciones disponibles para ${reason}:\n${slotsText}\n¿Cuál prefieres?`,
      nextPhase: 'scheduling',
      data: { availableSlots: slots }
    }
  }

  private async handleScheduling(session: CallSession, input: string) {
    // Extraer número de opción
    const match = input.match(/\d+/)
    const selection = match ? parseInt(match[0]) : null
    
    if (selection && selection >= 1 && selection <= session.availableSlots.length) {
      const selectedSlot = session.availableSlots[selection - 1]
      session.selectedSlot = selectedSlot
      
      return {
        message: `Perfecto. Confirmo tu cita para ${selectedSlot.date} a las ${selectedSlot.time}. ¿Confirmas?`,
        nextPhase: 'confirmation',
        data: { selectedSlot }
      }
    }
    
    return {
      message: 'No entendí tu selección. ¿Podrías decirme el número de la opción que prefieres?',
      nextPhase: 'scheduling'
    }
  }

  private async handleConfirmation(session: CallSession, input: string) {
    const confirmation = input.toLowerCase().includes('sí') || 
                        input.toLowerCase().includes('confirmo') ||
                        input.toLowerCase().includes('ok') ||
                        input.toLowerCase().includes('de acuerdo')
    
    if (confirmation && session.selectedSlot) {
      // Aquí se crearía la cita en Google Calendar
      console.log(`✅ Appointment confirmed: ${session.selectedSlot.date} at ${session.selectedSlot.time}`)
      
      return {
        message: `¡Perfecto! Tu cita está confirmada para ${session.selectedSlot.date} a las ${session.selectedSlot.time}. Te enviaremos un recordatorio. ¿Hay algo más en lo que pueda ayudarte?`,
        nextPhase: 'farewell',
        data: { appointmentConfirmed: true }
      }
    }
    
    return {
      message: 'Entendido. ¿Quieres ver otras opciones o prefieres que te llame un humano?',
      nextPhase: 'scheduling'
    }
  }

  private async handleFallback(session: CallSession, input: string) {
    return {
      message: 'Entendido. Un miembro de nuestro equipo te llamará en los próximos minutos. ¿Hay algo específico que debamos saber?',
      nextPhase: 'farewell',
      data: { callbackRequested: true }
    }
  }

  private checkCommonQuestions(input: string): string | null {
    const lowerInput = input.toLowerCase()
    
    // Verificar preguntas comunes
    if (lowerInput.includes('horario') || lowerInput.includes('abren') || lowerInput.includes('cierran')) {
      return COMMON_RESPONSES.horarios
    }
    
    if (lowerInput.includes('precio') || lowerInput.includes('cuánto cuesta') || lowerInput.includes('costo')) {
      return COMMON_RESPONSES.precios
    }
    
    if (lowerInput.includes('dónde están') || lowerInput.includes('ubicación') || lowerInput.includes('dirección')) {
      return COMMON_RESPONSES.ubicacion
    }
    
    if (lowerInput.includes('qué servicios') || lowerInput.includes('qué hacen') || lowerInput.includes('tratamientos')) {
      return COMMON_RESPONSES.servicios
    }
    
    if (lowerInput.includes('emergencia') || lowerInput.includes('urgente') || lowerInput.includes('dolor fuerte')) {
      return COMMON_RESPONSES.emergencia
    }
    
    return null
  }

  private extractPatientType(input: string): boolean | null {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('nuevo') || lowerInput.includes('primera vez') || lowerInput.includes('nunca')) {
      return true
    }
    
    if (lowerInput.includes('ya') || lowerInput.includes('antes') || lowerInput.includes('reincidente')) {
      return false
    }
    
    return null
  }

  private extractReasonAndUrgency(input: string): { reason: string, urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' } {
    const lowerInput = input.toLowerCase()
    
    // Extraer motivo
    let reason = 'consulta general'
    if (lowerInput.includes('limpieza')) reason = 'limpieza dental'
    else if (lowerInput.includes('dolor')) reason = 'tratamiento de dolor'
    else if (lowerInput.includes('revisión')) reason = 'revisión general'
    else if (lowerInput.includes('ortodoncia')) reason = 'tratamiento de ortodoncia'
    else if (lowerInput.includes('blanqueamiento')) reason = 'blanqueamiento dental'
    else if (lowerInput.includes('implante')) reason = 'implantes dentales'
    
    // Extraer urgencia
    let urgencyLevel: 'medium'
    if (lowerInput.includes('emergencia') || lowerInput.includes('urgente') || lowerInput.includes('hoy') || lowerInput.includes('ahora')) {
      urgencyLevel = 'high'
    }
    else if (lowerInput.includes('dolor fuerte') || lowerInput.includes('muy urgente')) {
      urgencyLevel = 'emergency'
    }
    
    return { reason, urgencyLevel }
  }

  private async generateAvailableSlots(tenantId: string, reason: string, urgencyLevel: string): Promise<any[]> {
    // Mock: en producción esto consultaría Google Calendar
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const baseSlots = [
      { date: tomorrow.toLocaleDateString('es-ES'), time: '10:30' },
      { date: tomorrow.toLocaleDateString('es-ES'), time: '11:00' },
      { date: tomorrow.toLocaleDateString('es-ES'), time: '15:30' },
      { date: tomorrow.toLocaleDateString('es-ES'), time: '16:00' },
      { date: tomorrow.toLocaleDateString('es-ES'), time: '17:00' }
    ]
    
    // Ajustar según urgencia
    if (urgencyLevel === 'emergency') {
      return baseSlots.slice(0, 2) // Solo primeros slots para emergencias
    }
    
    return baseSlots
  }

  private identifyTenantByPhone(phone: string): string {
    // Mock: en producción se buscaría en la base de datos
    const tenantMap = {
      '+34900123456': 'demo-tenant-1',
      '+34900234567': 'demo-tenant-2',
      '+34900345678': 'demo-tenant-3'
    }
    
    return tenantMap[phone] || 'default-tenant'
  }

  private async getTenantConfig(tenantId: string): Promise<any> {
    // Mock: en producción se obtendría de la base de datos
    return {
      clinicName: 'Clínica Dental Madrid',
      city: 'Madrid',
      workingHours: {
        monday: { enabled: true, open: '09:00', close: '20:00' },
        tuesday: { enabled: true, open: '09:00', close: '20:00' },
        wednesday: { enabled: true, open: '09:00', close: '20:00' },
        thursday: { enabled: true, open: '09:00', close: '20:00' },
        friday: { enabled: true, open: '09:00', close: '20:00' },
        saturday: { enabled: false, open: '09:00', close: '14:00' },
        sunday: { enabled: false, open: '09:00', close: '14:00' }
      },
      services: [
        { name: 'Limpieza Dental', duration: 30, price: 80 },
        { name: 'Revisión General', duration: 45, price: 60 },
        { name: 'Ortodoncia', duration: 30, price: 120 },
        { name: 'Blanqueamiento', duration: 90, price: 250 },
        { name: 'Urgencia', duration: 60, price: 150 }
      ]
    }
  }
}