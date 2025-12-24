/**
 * ServicAI Firebase Functions API
 * Express-based API for dental clinic receptionist SaaS
 */

const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Health Check
// ============================================
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "servicai-api",
    });
});

// ============================================
// Leads Endpoints
// ============================================

// Get all leads
app.get("/leads", async (req, res) => {
    try {
        const leadsSnapshot = await db
            .collection("leads")
            .orderBy("createdAt", "desc")
            .limit(100)
            .get();

        const leads = leadsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json({ success: true, leads, count: leads.length });
    } catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({ error: "Failed to fetch leads" });
    }
});

// Submit a new lead
app.post("/submit-lead", async (req, res) => {
    try {
        const { name, email, phone, message, clinicName } = req.body;

        // Validation
        if (!name || !email || !phone) {
            return res.status(400).json({
                error: "Missing required fields: name, email, phone",
            });
        }

        // Create lead document
        const leadData = {
            name,
            email,
            phone,
            message: message || "",
            clinicName: clinicName || "",
            status: "new",
            source: "website",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const leadRef = await db.collection("leads").add(leadData);

        res.json({
            success: true,
            id: leadRef.id,
            message: "Lead submitted successfully",
        });
    } catch (error) {
        console.error("Error submitting lead:", error);
        res.status(500).json({ error: "Failed to submit lead" });
    }
});

// Update lead status
app.patch("/leads/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const updateData = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (status) updateData.status = status;
        if (notes) updateData.notes = notes;

        await db.collection("leads").doc(id).update(updateData);

        res.json({ success: true, message: "Lead updated successfully" });
    } catch (error) {
        console.error("Error updating lead:", error);
        res.status(500).json({ error: "Failed to update lead" });
    }
});

// ============================================
// Voice/Twilio Webhook
// ============================================
app.post("/voice/webhook", async (req, res) => {
    try {
        const { From, To, CallSid, CallStatus } = req.body;

        // Log call to Firestore
        await db.collection("calls").add({
            from: From,
            to: To,
            callSid: CallSid,
            status: CallStatus,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        // TwiML response for Spanish
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="es-ES">Bienvenido a ServicAI, su recepcionista virtual para clínicas dentales. Por favor, deje su mensaje después del tono.</Say>
  <Record maxLength="60" transcribe="true" transcribeCallback="/api/voice/transcription"/>
  <Say language="es-ES">Gracias por su mensaje. Le contactaremos pronto.</Say>
</Response>`;

        res.type("text/xml");
        res.send(twiml);
    } catch (error) {
        console.error("Error handling voice webhook:", error);
        res.status(500).send("Error processing call");
    }
});

// Transcription callback
app.post("/voice/transcription", async (req, res) => {
    try {
        const { TranscriptionText, CallSid, RecordingUrl } = req.body;

        // Update call with transcription
        const callsSnapshot = await db
            .collection("calls")
            .where("callSid", "==", CallSid)
            .limit(1)
            .get();

        if (!callsSnapshot.empty) {
            const callDoc = callsSnapshot.docs[0];
            await callDoc.ref.update({
                transcription: TranscriptionText,
                recordingUrl: RecordingUrl,
                transcribedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Error handling transcription:", error);
        res.sendStatus(500);
    }
});



// VAPI Webhook (for AI Calls)
app.post("/voice/vapi-webhook", async (req, res) => {
    try {
        const payload = req.body;

        // Handle different message types
        if (payload.message && payload.message.type === "end-of-call-report") {
            const report = payload.message;

            await db.collection("calls").add({
                from: "VAPI Web", // or extract from report.customer.number if available
                to: "AI Receptionist",
                callSid: report.call.id,
                status: "completed",
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                transcription: report.transcript || report.summary || "No transcription",
                recordingUrl: report.recordingUrl || null,
                provider: "vapi",
                cost: report.cost,
                duration: report.durationSeconds
            });

            console.log("VAPI Call logged:", report.call.id);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Error handling VAPI webhook:", error);
        res.sendStatus(500);
    }
});

// ============================================
// Google Calendar Integration
// ============================================
const { google } = require("googleapis");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CALENDAR_ID = process.env.CALENDAR_ID || "iastudentimplemetation@gmail.com";

// Auth Client (Robust Strategy)
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "./google-service-account.json"),
    scopes: SCOPES,
});

const calendar = google.calendar({ version: "v3", auth });

// Helper: Check Availability
async function checkRealAvailability(date) {
    try {
        // Parse date (simplify: 'tomorrow' handled by VAPI/GPT usually, but let's handle YYYY-MM-DD)
        let timeMin, timeMax;

        if (date.toLowerCase() === "tomorrow") {
            const tmr = new Date();
            tmr.setDate(tmr.getDate() + 1);
            timeMin = new Date(tmr.setHours(9, 0, 0, 0)).toISOString();
            timeMax = new Date(tmr.setHours(18, 0, 0, 0)).toISOString();
        } else {
            // Assume YYYY-MM-DD
            const d = new Date(date);
            timeMin = new Date(d.setHours(9, 0, 0, 0)).toISOString();
            timeMax = new Date(d.setHours(18, 0, 0, 0)).toISOString();
        }

        const eventsRes = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: timeMin,
            timeMax: timeMax,
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = eventsRes.data.items || [];
        const busySlots = events.map(e => {
            const start = new Date(e.start.dateTime || e.start.date).getHours();
            return start; // simple blocking by hour
        });

        // Simple logic: 9am to 6pm, 1 hour slots
        const availableSlots = [];
        for (let h = 9; h < 18; h++) {
            if (!busySlots.includes(h)) {
                availableSlots.push(`${h}:00`);
            }
        }

        if (availableSlots.length === 0) return "No slots available for this date.";
        return `Available slots: ${availableSlots.join(", ")}.`;

    } catch (error) {
        console.error("Calendar Check Error:", error);
        return "Error checking calendar. Please try again.";
    }
}

// Helper: Book Appointment
async function bookRealAppointment(name, phone, date, time, reason) {
    try {
        const startDateTime = new Date(`${date}T${time}:00`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

        const event = {
            summary: `Cita: ${name} (${reason})`,
            description: `Phone: ${phone}\nReason: ${reason}`,
            start: { dateTime: startDateTime.toISOString() },
            end: { dateTime: endDateTime.toISOString() },
        };

        const res = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
        });

        return res.data.htmlLink;
    } catch (error) {
        console.error("Calendar Booking Error:", error);
        throw error;
    }
}


// ============================================
// Tools Handlers (for VAPI/AI)
// ============================================

app.post("/tools/handler", async (req, res) => {
    try {
        const toolCall = req.body.message.toolCalls[0];

        if (!toolCall) {
            return res.status(200).json({ results: [] });
        }

        const { id, type, function: func } = toolCall;
        const result = {
            toolCallId: id,
            result: "Error: Tool not found"
        };

        if (func.name === "checkAvailability") {
            const date = func.arguments.date || "tomorrow";
            result.result = await checkRealAvailability(date);
        }
        else if (func.name === "bookAppointment") {
            const { name, phone, date, time, reason } = func.arguments;

            // 1. Book in Google Calendar
            const calendarLink = await bookRealAppointment(name, phone, date, time, reason || "General");

            // 2. Save to Firestore (Audit/Dashboard)
            const docRef = await db.collection("appointments").add({
                name,
                phone,
                date,
                time,
                reason: reason || "General Checkup",
                status: "confirmed",
                googleCalendarLink: calendarLink,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            result.result = `Appointment confirmed for ${name} on ${date} at ${time}.`;
        }

        res.json({
            results: [result]
        });

    } catch (error) {
        console.error("Error handling tool call:", error);
        res.status(500).json({ error: "Tool execution failed" });
    }
});


// ============================================
// Calls Endpoints
// ============================================

// Get all calls (Reception logs)
app.get("/calls", async (req, res) => {
    try {
        const callsSnapshot = await db
            .collection("calls")
            .orderBy("timestamp", "desc")
            .limit(100)
            .get();

        const calls = callsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Convert timestamp to string if needed, or handle in frontend
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toISOString() : null
        }));

        res.json({ success: true, calls });
    } catch (error) {
        console.error("Error fetching calls:", error);
        res.status(500).json({ error: "Failed to fetch calls" });
    }
});

// ============================================
// Appointments Endpoints
// ============================================

app.get("/appointments", async (req, res) => {
    try {
        const appointmentsSnapshot = await db
            .collection("appointments")
            .orderBy("date", "desc")
            .orderBy("time", "asc")
            .limit(100)
            .get();

        const appointments = appointmentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

// ============================================
// Dashboard Stats
// ============================================
app.get("/dashboard/stats", async (req, res) => {
    try {
        // Get total leads
        const leadsSnapshot = await db.collection("leads").get();
        const totalLeads = leadsSnapshot.size;

        // Get leads by status
        const newLeads = leadsSnapshot.docs.filter(
            (doc) => doc.data().status === "new",
        ).length;
        const qualifiedLeads = leadsSnapshot.docs.filter(
            (doc) => doc.data().status === "qualified",
        ).length;

        // Get total calls
        const callsSnapshot = await db.collection("calls").get();
        const totalCalls = callsSnapshot.size;

        // Calculate stats
        const qualifiedPercentage = totalLeads > 0 ?
            Math.round((qualifiedLeads / totalLeads) * 100) : 0;

        res.json({
            success: true,
            stats: {
                totalLeads,
                newLeads,
                qualifiedLeads,
                qualifiedPercentage,
                totalCalls,
                averageResponseTime: "< 1 min", // Placeholder
            },
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// ============================================
// Error handling
// ============================================
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

// Export the API as a Cloud Function
// Export the API as a Cloud Function
const main = express();
// Handle requests with /api prefix (strips /api so app sees /health)
main.use("/api", app);
// Handle requests without prefix (fallback)
main.use("/", app);

exports.api = onRequest({
    region: "europe-west1",
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: "256MiB",
}, main);
