# Siddique Medical Complex — Patient Management System

A Next.js 15 web app for Dr. Zahid Mahmood (MBBS, FCPS, Paediatrician) to manage patient records and print prescriptions.

## Features
- Register new patients with full clinical details and medications
- Preview prescription slip before saving
- Save to MongoDB and print directly to attached printer
- Search existing records by name, MR number, or diagnosis
- Re-print any past record

## Setup

### 1. Clone & install
```bash
git clone <repo>
cd smc_web
npm install
```

### 2. Configure MongoDB
Copy `.env.example` to `.env.local` and fill in your MongoDB URI:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smc_db?retryWrites=true&w=majority
```

### 3. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add `MONGODB_URI` as an environment variable in Vercel project settings
4. Deploy — done!

## Print Setup
The app uses `window.print()` which sends to the system default printer.
On the clinic PC, set the physical printer as default in Windows/OS settings.
Print media CSS is included so only the prescription slip prints (no navigation UI).

## Project Structure
```
app/
  page.tsx              — Home / dashboard
  new-patient/page.tsx  — New patient form + preview
  search/page.tsx       — Search existing records
  api/patients/
    route.ts            — POST (create) / GET (list)
    search/route.ts     — GET search

components/
  PrintSlip.tsx         — Prescription slip (print-ready)

lib/
  mongodb.ts            — Mongoose connection helper

models/
  Patient.ts            — Patient schema
```
