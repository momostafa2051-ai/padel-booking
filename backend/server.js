const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());

// Database Helper
function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  return { courts: [], slots: [], bookings: [] };
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function seedDB() {
  const db = loadDB();
  if (db.courts.length === 0) {
    // Sample Courts
    db.courts = [
      { id: 1, name: 'ملعب اول', location: '6th October', pricePerHour: 150, imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8' },
      { id: 2, name: 'ملعب تاني', location: 'Sheikh Zayed', pricePerHour: 200, imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8' },
      { id: 3, name: 'ملعب ثالث', location: 'Heliopolis', pricePerHour: 180, imageUrl: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8' }
    ];

    // Sample Slots (next 7 days)
    const today = new Date();
    let slotId = 1;
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(today.getDate() + day);
      const dateStr = date.toISOString().split('T')[0];
      
      const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
      times.forEach(time => {
        const endHour = parseInt(time.split(':')[0]) + 1;
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        
        for (let courtId = 1; courtId <= 3; courtId++) {
          db.slots.push({ id: slotId++, courtId, date: dateStr, startTime: time, endTime, isAvailable: true });
        }
      });
    }
    
    db.bookings = [];
    saveDB(db);
    console.log('✅ Sample data seeded');
  }
}

// Initialize
seedDB();

// ==================== ROUTES ====================

// GET /api/courts - List all courts
app.get('/api/courts', (req, res) => {
  try {
    const db = loadDB();
    res.json({ success: true, data: db.courts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/courts/:id - Get court details
app.get('/api/courts/:id', (req, res) => {
  try {
    const db = loadDB();
    const court = db.courts.find(c => c.id === parseInt(req.params.id));
    if (!court) {
      return res.status(404).json({ success: false, error: 'Court not found' });
    }
    res.json({ success: true, data: court });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/slots - Get available slots
app.get('/api/slots', (req, res) => {
  try {
    const db = loadDB();
    const { courtId, date } = req.query;
    
    let slots = db.slots.filter(s => s.isAvailable);
    
    if (courtId) {
      slots = slots.filter(s => s.courtId === parseInt(courtId));
    }
    if (date) {
      slots = slots.filter(s => s.date === date);
    }
    
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/bookings - Create booking
app.post('/api/bookings', (req, res) => {
  try {
    const db = loadDB();
    const { courtId, slotId, userName, userPhone } = req.body;
    
    if (!courtId || !slotId || !userName || !userPhone) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    const slot = db.slots.find(s => s.id === slotId && s.isAvailable);
    if (!slot) {
      return res.status(404).json({ success: false, error: 'Slot not available' });
    }
    
    const booking = {
      id: db.bookings.length + 1,
      courtId,
      slotId,
      userName,
      userPhone,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: 'confirmed'
    };
    
    db.bookings.push(booking);
    slot.isAvailable = false;
    saveDB(db);
    
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/bookings - List bookings
app.get('/api/bookings', (req, res) => {
  try {
    const db = loadDB();
    const { phone } = req.query;
    
    let bookings = db.bookings;
    if (phone) {
      bookings = bookings.filter(b => b.userPhone === phone);
    }
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/bookings/:id - Cancel booking
app.delete('/api/bookings/:id', (req, res) => {
  try {
    const db = loadDB();
    const booking = db.bookings.find(b => b.id === parseInt(req.params.id));
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    
    db.bookings = db.bookings.filter(b => b.id !== parseInt(req.params.id));
    const slot = db.slots.find(s => s.id === booking.slotId);
    if (slot) slot.isAvailable = true;
    
    saveDB(db);
    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Padel Booking API is running', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
🎾 Padel Booking API Running!
📋 API Documentation:

GET  /api/courts                    - List all courts
GET  /api/courts/:id                - Get court details
GET  /api/slots?courtId=X&date=YYYY-MM-DD  - Get available slots
POST /api/bookings                  - Create booking
GET  /api/bookings?phone=X          - List bookings
DELETE /api/bookings/:id            - Cancel booking
GET  /api/health                    - Health check

Example POST /api/bookings:
{
  "courtId": 1,
  "slotId": 5,
  "userName": "Eng Mo",
  "userPhone": "0123456789"
}
  `);
});