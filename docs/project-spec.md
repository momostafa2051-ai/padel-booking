# Padel Court Booking App - Specification

## Overview
- iOS App for booking padel courts
- Backend API for managing courts, slots, and bookings
- REST API output format

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: SQLite (simple, portable)
- **iOS App**: SwiftUI
- **API Format**: JSON REST

## Features
1. View available courts
2. View available time slots
3. Book a court
4. View my bookings
5. Cancel booking

## API Endpoints

### Courts
- `GET /api/courts` - List all courts
- `GET /api/courts/:id` - Get court details

### Slots
- `GET /api/slots?courtId=X&date=YYYY-MM-DD` - Get available slots

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List user bookings
- `DELETE /api/bookings/:id` - Cancel booking

## Data Models

### Court
```json
{
  "id": 1,
  "name": "Court 1",
  "location": "6th October",
  "pricePerHour": 150,
  "imageUrl": "..."
}
```

### Slot
```json
{
  "id": 1,
  "courtId": 1,
  "date": "2026-08-15",
  "startTime": "09:00",
  "endTime": "10:00",
  "isAvailable": true
}
```

### Booking
```json
{
  "id": 1,
  "courtId": 1,
  "slotId": 1,
  "userName": "Eng Mo",
  "userPhone": "0123456789",
  "date": "2026-08-15",
  "startTime": "09:00",
  "endTime": "10:00",
  "status": "confirmed"
}
```