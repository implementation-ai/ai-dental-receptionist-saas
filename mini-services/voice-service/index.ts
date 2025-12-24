import express from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { CallHandler } from './src/handlers/callHandler'

dotenv.config()

const app = express()
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

const callHandler = new CallHandler(io)

// Endpoints HTTP para webhook de proveedor de voz
app.post('/calls/incoming', callHandler.handleIncomingCall.bind(callHandler))
app.post('/calls/status', callHandler.handleStatusUpdate.bind(callHandler))
app.post('/calls/transcript', callHandler.handleTranscript.bind(callHandler))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Socket.io para streaming en tiempo real
io.on('connection', (socket) => {
  console.log('Client connected to voice service:', socket.id)
  
  socket.on('join-call', (callId) => {
    socket.join(`call-${callId}`)
    console.log(`Socket ${socket.id} joined call ${callId}`)
  })
  
  socket.on('speech-input', async (data) => {
    await callHandler.processSpeechInput(socket, data)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

const PORT = process.env.VOICE_SERVICE_PORT || 3003
server.listen(PORT, () => {
  console.log(`🤖 AI Voice Service running on port ${PORT}`)
  console.log(`📞 Ready to handle dental clinic calls`)
  console.log(`🔗 WebSocket server listening for real-time communication`)
})