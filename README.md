# Smart Digital Clinic System 🩺

A premium, affordable, and easy-to-use digital ecosystem specifically designed for small solo clinics to replace paper-based systems.

## 🌟 Key Features

- **Doctor Dashboard**: Unified view of appointments, revenue, and recent activities.
- **Patient Management**: Secure registration, searchable history, and unique Patient IDs.
- **Appointment Queue**: Live token-based tracking with walk-in support.
- **Digital Consultation**: Streamlined symptom tracking, diagnosis, and prescription builder.
- **Billing & Analytics**: Professional invoice generation and performance charts.
- **Modern Aesthetics**: Premium Glassmorphism design with responsive mobile-ready layout.

## 🛠 Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Vanilla CSS (Global Design System)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Navigation**: React Router 6

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/pages`: Individual module pages (Patients, Consultation, Billing, etc.)
- `src/components`: Reusable UI components.
- `src/context`: Authentication and global state.
- `src/styles`: Design system and global variables.
- `src/services`: (Future) Firebase/API integration.

## 🏛 Ecosystem Flow

`Patient` → `Appointment` → `Consultation` → `Prescription` → `Billing` → `Analytics`

---
*Built with ❤️ for Solo Doctors.*
