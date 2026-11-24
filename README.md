# 🌸 SakhiShakti — Rural Women's Safety, Health & Empowerment Platform

<div align="center">

![SakhiShakti Banner](https://img.shields.io/badge/SakhiShakti-Empowering%20Rural%20Women-pink?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Zero Paid APIs](https://img.shields.io/badge/Zero%20Paid%20APIs-✓-success?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA%20Ready-✓-blue?style=for-the-badge)

**A production-ready, zero-paid-API platform empowering rural Indian women with safety tools, health intelligence, government scheme discovery, and community support.**

[🚀 Live Demo](#) · [📖 Documentation](#architecture) · [🤝 Contribute](#contributing)

</div>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🆘 **SOS Safety** | One-tap emergency calls (112/181/108), live GPS map (OpenStreetMap/Leaflet), SMS alert with coordinates |
| 🏥 **Health Hub** | Age-wise health cards with TTS, PCOS AI risk screener, period tracker, random doctor video connect |
| 📋 **Govt Schemes** | 11 central and state schemes (PMMVY, JSY, Ladli Behna…) with eligibility checker & step-by-step apply guide |
| 🤝 **Community** | Support requests, UPI donations with QR code, clothes donation pickup |
| 🌐 **i18n** | English + Hindi, scalable to all 22 Scheduled Indian Languages |
| 🌙 **Themes** | Full Dark/Light mode, mobile-first rural UX |
| 📡 **Offline PWA** | Emergency helplines cached for offline access |

---

## 🏗️ Architecture

```
SakhiShakti/
├── frontend/          # React (Vite) + Tailwind CSS + Leaflet          [Port 5173]
├── backend/           # Node.js + Express + Socket.io + Mongoose       [Port 5000]
├── ml-service/        # Python + FastAPI + Scikit-Learn                [Port 8000]
├── package.json       # Root — concurrently runs all 3 services
└── README.md
```

### Technology Stack (Zero Paid APIs)

| Layer | Technology |
|-------|------------|
| Maps | OpenStreetMap + Leaflet (`react-leaflet`) |
| Geolocation | Browser Geolocation API |
| Text-to-Speech | Web Speech API (`window.speechSynthesis`) |
| Emergency Calls | Native `tel:` deep links |
| SMS Alert | Native `sms:` deep links |
| Payments | `upi://pay` deep links + QR code |
| Video/Audio | WebRTC + Socket.io signaling |
| ML | Scikit-Learn (RandomForest + GradientBoosting) |
| Auth | JWT (jsonwebtoken) |
| DB | MongoDB (Mongoose) with JSON file fallback |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.9 with `pip`
- **Git**
- MongoDB (optional — app runs with JSON fallback if unavailable)

### 1. Clone the Repository

```bash
git clone https://github.com/kritikarma2007/Sakhi_Shakti.git
cd Sakhi_Shakti
```

### 2. Install All Dependencies

```bash
# Install root + frontend + backend dependencies
npm run install:all

# Install Python dependencies
cd ml-service
pip install -r requirements.txt
cd ..
```

### 3. Train ML Models

```bash
npm run train
# OR
cd ml-service && python train_models.py
```

This generates `pcos_model.pkl` and `cycle_model.pkl` inside `/ml-service`. If Kaggle datasets are not present in `/ml-service/data/`, synthetic data is auto-generated.

### 4. Configure Environment (Optional)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — add MONGO_URI if you have MongoDB
# App runs fine without MongoDB using JSON file fallback
```

### 5. Seed Demo Data

```bash
npm run seed
```

### 6. Run All Services (Single Command)

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (React) | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| ML Service (FastAPI) | http://localhost:8000 |
| ML API Docs | http://localhost:8000/docs |

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | `demo@sakhishakti.in` | `Demo@123` |
| Doctor | `doctor@sakhishakti.in` | `Demo@123` |
| Volunteer | `volunteer@sakhishakti.in` | `Demo@123` |
| Admin | `admin@sakhishakti.in` | `Demo@123` |

---

## 🔌 API Reference

### ML Service (Port 8000)

```
GET  /health                   → Service health check
POST /predict-pcos             → PCOS risk assessment
POST /predict-cycle            → Menstrual cycle prediction
```

### Backend API (Port 5000)

```
POST /api/auth/register        → Register new user
POST /api/auth/login           → Login
GET  /api/health-cards         → Age-wise health cards
GET  /api/schemes              → Government schemes (filterable)
GET  /api/support-requests     → Community support requests
POST /api/support-requests     → Create support request
GET  /api/donations            → Donation records
POST /api/donations            → Create donation record
```

---

## 🌐 Internationalization

The app ships with **English** and **Hindi** dictionaries and a scalable i18n architecture:

```
frontend/src/i18n/
├── en.json          # English (default)
├── hi.json          # Hindi (default fallback)
├── bn.json          # Bengali (extend)
├── te.json          # Telugu (extend)
└── ...              # All 22 Scheduled Indian Languages
```

Add a new language by creating `<lang-code>.json` following the same key structure as `en.json`.

---

## 🤝 Contributing

We welcome contributions! Here's how to collaborate on GitHub:

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/<your-username>/Sakhi_Shakti.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make changes and commit
git add .
git commit -m "feat: add <your feature>"

# 5. Push and create a Pull Request
git push origin feature/your-feature-name
```

### Branch Naming Convention
- `feature/<name>` — New feature
- `fix/<name>` — Bug fix
- `i18n/<lang>` — New language support
- `ml/<model>` — ML model improvements

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

<div align="center">
Made with ❤️ for rural India · <a href="https://github.com/kritikarma2007/Sakhi_Shakti">GitHub Repository</a>
</div>
