# 🎾 Padel Court Booking App

## المشروع
تطبيق iOS لحجز ملاعب البادل مع Backend API

## الملفات

```
padel-booking/
├── backend/
│   ├── package.json
│   └── server.js
├── ios/
│   ├── PadelBookingApp.swift
│   ├── ContentView.swift
│   ├── CourtsView.swift
│   ├── Models.swift
│   ├── SlotPickerView.swift
│   ├── BookingFormView.swift
│   └── MyBookingsView.swift
└── docs/
    └── project-spec.md
```

## تشغيل Backend

```bash
cd backend
npm install
npm start
```

الـ API يشتغل على `http://localhost:3000`

## تشغيل iOS App

1. افتح الـ ios folder في Xcode
2. غير `YOUR_SERVER_IP` لـ IP السيرفر بتاعك
3. شغّل على simulator أو device

## API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/courts` | عرض كل الملاعب |
| GET | `/api/courts/:id` | تفاصيل ملعب معين |
| GET | `/api/slots?courtId=X&date=YYYY-MM-DD` | الأوقات المتاحة |
| POST | `/api/bookings` | حجز ملعب |
| GET | `/api/bookings?phone=X` | عرض حجوزاتي |
| DELETE | `/api/bookings/:id` | إلغاء الحجز |

## مثال حجز

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "courtId": 1,
    "slotId": 5,
    "userName": "أحمد",
    "userPhone": "0123456789"
  }'
```