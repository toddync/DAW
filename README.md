# Hotel Booking App

A full-stack hotel booking application built with Next.js, React, TypeScript, TailwindCSS, and Supabase.

## Features

- Browse available hotel rooms with detailed information
- View bed types, amenities, and pricing
- Select date ranges and check availability in real-time
- Book beds with guest name and automatic price calculation
- Responsive design with clean UI using shadcn/ui components
- Client-side state management with Zustand
- Full test coverage for availability logic

## Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: TailwindCSS v4
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Client**: @supabase/ssr

### Testing
- **Framework**: Jest
- **Utilities**: Availability logic tests

## Project Structure

\`\`\`
├── app/
│   ├── layout.tsx              # Root layout with date picker
│   ├── page.tsx                # Homepage - room listing
│   ├── rooms/[id]/page.tsx     # Room details page
│   ├── api/
│   │   ├── rooms/              # Room API endpoints
│   │   ├── availability/       # Availability checking
│   │   └── bookings/           # Booking management
│   └── globals.css
├── components/
│   ├── booking-modal.tsx       # Booking confirmation modal
│   ├── date-range-picker.tsx   # Date selection component
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase-server.ts      # Server-side Supabase client
│   ├── supabase-client.ts      # Client-side Supabase client
│   ├── types.ts                # TypeScript type definitions
│   ├── store.ts                # Zustand store
│   └── availability.ts         # Availability logic utilities
├── __tests__/
│   └── availability.test.ts    # Unit tests
└── scripts/
    ├── schema.sql              # Database schema
    └── seed.sql                # Seed data
\`\`\`

## Getting Started

### 1. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 2. Create Database Schema

Run the SQL schema in your Supabase SQL editor:
- Open `scripts/schema.sql` and execute all commands
- Open `scripts/seed.sql` and execute to populate sample data

### 3. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

## API Endpoints

### Rooms
- `GET /api/rooms` - List all rooms with beds (optional date range for availability)
- `GET /api/rooms/[id]` - Get room details with all beds

### Availability
- `GET /api/availability?bedId=&start=&end=` - Check if a bed is available for date range

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings?bedId=` - List bookings (optional bed filter)

## Booking Rules

1. **Date Range**: End date is exclusive (checkout date)
2. **Availability**: No overlapping bookings on the same bed
3. **Past Dates**: Cannot book dates in the past
4. **Price**: Calculated as `price_per_night × number_of_nights`

## Testing

Run unit tests for availability logic:

\`\`\`bash
npm test
\`\`\`

## Database Schema

### Rooms Table
- `id` (UUID, PK)
- `name` (TEXT)
- `description` (TEXT)
- `amenities` (TEXT[])
- `bathroom` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)

### Beds Table
- `id` (UUID, PK)
- `room_id` (UUID, FK → rooms.id)
- `label` (TEXT)
- `type` (TEXT: single/couple/bunk)
- `position` (TEXT: near_door/center/window)
- `amenities` (TEXT[])
- `price_per_night` (NUMERIC)
- `created_at` (TIMESTAMPTZ)

### Bookings Table
- `id` (UUID, PK)
- `bed_id` (UUID, FK → beds.id)
- `start_date` (DATE)
- `end_date` (DATE)
- `guest_name` (TEXT)
- `created_at` (TIMESTAMPTZ)

**Index**: `bookings_bed_id_dates_idx` on (bed_id, start_date, end_date)

## Key Features Explained

### Availability Checking
The app uses efficient date range overlap detection to prevent double-bookings:
\`\`\`sql
NOT (end_date <= start OR start_date >= end)
\`\`\`

### Client-Side State Management
Zustand manages:
- Selected date range (persistent across navigation)
- Selected bed for booking
- Loading states during booking

### Responsive Design
- Mobile-first layout
- Grid layouts for beds and rooms
- Touch-friendly buttons and forms

## ESLint & Prettier

The project includes ESLint and Prettier configuration for code quality:

\`\`\`bash
npm run lint        # Run linter
npm run format      # Format code
\`\`\`

## Deployment

Deploy to Vercel:

\`\`\`bash
npm run build
npx vercel deploy
\`\`\`

## License

MIT
