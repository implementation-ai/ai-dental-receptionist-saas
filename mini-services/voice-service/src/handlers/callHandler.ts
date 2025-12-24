import { Socket } from 'socket.io'
import ZAI from 'z-ai-web-dev-sdk'

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

export class CallHandler {
  private activeCalls: Map<string, CallSession> = new Map()
  private zai: ZAI

  constructor(private io: any) {
    this.zai = new ZAI()
  }

  async handleIncomingCall(req: any, res: any) {
    const { CallSid, From, To } = req.body
    
    try {
      // Mock: identificar tenant por número (en producción vendría de BD)
      const tenantId = this.identifyTenantByPhone(To)
      
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
        context: {},
        createdAt: new Date()
      }
      
      this.activeCalls.set(CallSid, session)
      console.log(`📞 New call session created: ${CallSid}`)
      
      // Generar saludo personalizado
      const greetingResponse = await this.generateGreeting(tenantId)
      
      // Enviar respuesta de voz (simulado)
      console.log(`🗣️ AI Response: ${greetingResponse}`)
      
      res.status(200).send('<Response><Say>Hola, has llamado a Clínica Dental Madrid. Soy la recepcionista virtual. ¿En qué puedo ayudarte?</Say></Response>')
    } catch (error) {
      console.error('Error handling incoming call:', error)
      res.status(500).send('Error')
    }
  }

  async handleStatusUpdate(req: any, res: any) {
    const { CallSid, CallStatus } = req.body
    
    try {
      const session = this.activeCalls.get(CallSid)
      if (session) {
        console.log(`📊 Call ${CallSid} status updated to: ${CallStatus}`)
        
        if (CallStatus === 'completed') {
          // Limpiar sesión cuando la llamada termina
          this.activeCalls.delete(CallSid)
          console.log(`📞 Call session ${CallSid} completed and cleaned up`)
        }
      }
      
      res.status(200).send('OK')
    } catch (error) {
      console.error('Error handling status update:', error)
      res.status(500).send('Error')
    }
  }

  async handleTranscript(req: any, res: any) {
    const { CallSid, transcript, confidence } = req.body
    
    try {
      const session = this.activeCalls.get(CallSid)
      if (session) {
        console.log(`📝 Transcript for ${CallSid}: "${transcript}" (confidence: ${confidence})`)
        
        // Procesar transcripción y generar respuesta
        const response = await this.processTranscript(session, transcript)
        
        // Enviar respuesta a través de WebSocket
        this.io.to(`call-${CallSid}`).emit('ai-response', {
          message: response,
          phase: session.phase
        })
      }
      
      res.status(200).send('OK')
    } catch (error) {
      console.error('Error handling transcript:', error)
      res.status(500).send('Error')
    }
  }

  async processSpeechInput(socket: Socket, data: any) {
    const { callId, transcript, confidence } = data
    const session = this.activeCalls.get(callId)
    
    if (!session) return
    
    try {
      console.log(`🎤 Processing speech input for ${callId}: "${transcript}"`)
      
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
      session.context = { ...session.context, ...response.context }
      
    } catch (error) {
      console.error('Error processing speech input:', error)
      socket.emit('ai-response', {
        message: 'Lo siento, no entendí. ¿Puedes repetir?',
        phase: session.phase
      })
    }
  }

  private async processByPhase(session: CallSession, input: string) {
    const { phase } = session
    
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
    return {
      message: 'Para ayudarte mejor, necesito saber: ¿Es usted paciente nuevo o ya nos ha visitado antes?',
      nextPhase: 'identification',
      context: { lastInput: input }
    }
  }

  private async handleIdentification(session: CallSession, input: string) {
    const isNewPatient = input.toLowerCase().includes('nuevo') || 
                        input.toLowerCase().includes('primera vez') ||
                        input.toLowerCase().includes('nunca')
    
    session.patientInfo.isNewPatient = isNewPatient
    
    if (isNewPatient !== null) {
      return {
        message: '¡Bienvenido! ¿Cuál es el motivo de tu consulta? (limpieza, dolor, revisión, tratamiento específico)',
        nextPhase: 'qualification',
        context: { isNewPatient }
      }
    }

    return {
      message: '¿Es usted paciente nuevo o ya nos ha visitado antes?',
      nextPhase: 'identification',
      context: session.context
    }
  }

  private async handleQualification(session: CallSession, input: string) {
    // Extraer motivo y urgencia
    const hasUrgency = input.toLowerCase().includes('dolor') || 
                       input.toLowerCase().includes('urgente') ||
                       input.toLowerCase().includes('hoy')
    
    const reason = this.extractReason(input)
    const urgencyLevel = hasUrgency ? 'high' : 'medium'
    
    session.appointmentInfo.reason = reason
    session.appointmentInfo.urgencyLevel = urgencyLevel
    
    // Generar slots disponibles (mock)
    const slots = this.generateMockSlots()
    session.availableSlots = slots
    
    const slotsText = slots.map((slot, index) => 
      `${index + 1}. ${slot.date} a las ${slot.time}`
    ).join('\n')
    
    return {
      message: `Tengo estas opciones disponibles para ${reason}:\n${slotsText}\n¿Cuál prefieres?`,
      nextPhase: 'scheduling',
      context: { reason, urgencyLevel, availableSlots: slots }
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
        context: { selectedSlot }
      }
    }

    return {
      message: 'No entendí tu selección. ¿Podrías decirme el número de la opción que prefieres?',
      nextPhase: 'scheduling',
      context: session.context
    }
  }

  private async handleConfirmation(session: CallSession, input: string) {
    const confirmation = input.toLowerCase().includes('sí') || 
                        input.toLowerCase().includes('confirmo') ||
                        input.toLowerCase().includes('ok')

    if (confirmation) {
      // En producción, aquí se crearía la cita en Google Calendar y BD
      console.log(`✅ Appointment confirmed for ${session.selectedSlot.date} at ${session.selectedSlot.time}`)
      
      return {
        message: `¡Perfecto! Tu cita está confirmada para ${session.selectedSlot.date} a las ${session.selectedSlot.time}. Te enviaremos un recordatorio. ¿Hay algo más en lo que pueda ayudarte?`,
        nextPhase: 'farewell',
        context: { appointmentConfirmed: true }
      }
    }

    return {
      message: 'Entendido. ¿Quieres ver otras opciones o prefieres que te llame un humano?',
      nextPhase: 'scheduling',
      context: session.context
    }
  }

  private async handleFallback(session: CallSession, input: string) {
    return {
      message: 'Entendido. Un miembro de nuestro equipo te llamará en los próximos minutos. ¿Hay algo específico que debamos saber?',
      nextPhase: 'farewell',
      context: { callbackRequested: true }
    }
  }

  private async generateGreeting(tenantId: string): Promise<string> {
    // En producción, esto vendría de la BD con prompts personalizados
    return 'Hola, has llamado a Clínica Dental Madrid. Soy la recepcionista virtual. ¿En qué puedo ayudarte?'
  }

  private async processTranscript(session: CallSession, transcript: string): Promise<string> {
    // Procesamiento simple de transcripción
    const response = await this.processByPhase(session, transcript)
    return response.message
  }

  private identifyTenantByPhone(phone: string): string {
    // Mock: en producción se buscaría en la BD
    return 'demo-tenant'
  }

  private extractReason(input: string): string {
    if (input.toLowerCase().includes('limpieza')) return 'limpieza'
    if (input.toLowerCase().includes('dolor')) return 'urgencia dolor'
    if (input.toLowerCase().includes('revisión')) return 'revisión'
    if (input.toLowerCase().includes('ortodoncia')) return 'ortodoncia'
    if (input.toLowerCase().includes('blanqueamiento')) return 'blanqueamiento'
    return 'consulta general'
  }

  private generateMockSlots() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return [
      {
        date: tomorrow.toLocaleDateString('es-ES'),
        time: '10:30',
        dateTime: new Date(tomorrow.setHours(10, 30)).toISOString()
      },
      {
        date: tomorrow.toLocaleDateString('es-ES'),
        time: '15:00',
        dateTime: new Date(tomorrow.setHours(15, 0)).toISOString()
      },
      {
        date: tomorrow.toLocaleDateString('es-ES'),
        time: '17:30',
        dateTime: new Date(tomorrow.setHours(17, 30)).toISOString()
      }
    ]
  }
}