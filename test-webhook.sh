#!/bin/bash

# Script para probar el webhook de llamadas del AI Dental Receptionist

echo "🧪 Testing AI Dental Receptionist Webhook..."
echo "=================================="

# Test 1: Llamada entrante básica
echo "📞 Test 1: Incoming call webhook..."
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "CallSid": "CA12345678901234567890",
    "From": "+34600123456",
    "To": "+34900123456",
    "CallStatus": "ringing",
    "Direction": "inbound",
    "Timestamp": "2024-01-15T10:30:00Z"
  }' | jq '.'

echo ""
sleep 2

# Test 2: Llamada en progreso
echo "📞 Test 2: Call in progress..."
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "CallSid": "CA12345678901234567890",
    "From": "+34600123456",
    "To": "+34900123456",
    "CallStatus": "in-progress",
    "Direction": "inbound",
    "Timestamp": "2024-01-15T10:31:00Z"
  }' | jq '.'

echo ""
sleep 2

# Test 3: Llamada completada
echo "📞 Test 3: Call completed..."
curl -X POST http://localhost:3000/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "CallSid": "CA12345678901234567890",
    "From": "+34600123456",
    "To": "+34900123456",
    "CallStatus": "completed",
    "Direction": "inbound",
    "CallDuration": "245",
    "Timestamp": "2024-01-15T10:35:00Z"
  }' | jq '.'

echo ""
echo "=================================="
echo "🎉 Webhook tests completed!"
echo ""
echo "📊 Check the dashboard at: http://localhost:3000"
echo "📱 Check AI Voice Service logs for call processing"