# 🧬 Mass Balance AI

### Next-Generation Pharmaceutical Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

---

## 🎯 Overview

Mass Balance AI is a comprehensive pharmaceutical intelligence platform that automates mass balance calculations for stability studies. It combines advanced statistical methods with an intuitive interface to transform hours of manual Excel work into seconds of automated, validated analysis.

### Key Features

- ⚡ **Real-Time Calculations** - Auto-calculate mode with instant updates
- 📊 **Dual Statistical Methods** - LK-IMB and CIMB with 95% confidence intervals
- 📈 **Intelligence Dashboard** - AI-powered analytics with trend analysis
- 💾 **Export Options** - Professional PDF reports and CSV data export
- 🎨 **Modern UI** - Glassmorphism design with smooth animations
- 🔍 **Advanced Filtering** - Search and filter capabilities across all data

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **npm** v9+ (comes with Node.js)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mass-balance-ai-redesign
   ```

2. **Start the Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Backend runs on: `http://localhost:5000`

3. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

4. **Access the Application**
   
   Open your browser to `http://localhost:5173`

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│         FRONTEND (React + Vite)                 │
│  • Modern React 18 with hooks                   │
│  • Framer Motion animations                     │
│  • Recharts visualizations                      │
│  • Tailwind CSS styling                         │
│  • Real-time updates                            │
└────────────────┬────────────────────────────────┘
                 │ REST API (Axios)
                 ↓
┌─────────────────────────────────────────────────┐
│      BACKEND (Node.js + Express)                │
│  • Mass balance calculations (5 methods)        │
│  • Statistical analysis (t-distribution)        │
│  • 95% confidence intervals                     │
│  • Risk-based classification                    │
│  • SQLite persistence                           │
└─────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
mass-balance-ai-redesign/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main application
│   │   └── index.css     # Styles
│   ├── package.json
│   └── README.md         # Frontend documentation
│
├── backend/              # Node.js backend server
│   ├── server.js         # Express server
│   ├── mass_balance.db   # SQLite database
│   ├── package.json
│   └── README.md         # Backend documentation
│
└── README.md             # This file
```

---

## 🧪 Scientific Methods

The platform implements five mass balance calculation methods:

| Method | Use Case | Complexity |
|--------|----------|------------|
| **SMB** | Basic screening | Low |
| **AMB** | Low degradation | Low |
| **RMB** | Moderate degradation | Medium |
| **LK-IMB** | Advanced analysis | High |
| **CIMB** | Regulatory submission | High |

### Statistical Validation

- **95% Confidence Intervals** using t-distribution (df=2)
- **Uncertainty Propagation** through variance addition
- **Risk Classification:**
  - 🟢 **LOW** (98-102%): Excellent
  - 🟡 **MODERATE** (95-98% or 102-105%): Acceptable with justification
  - 🔴 **HIGH** (<95% or >105%): Investigation required

---

## 📚 Documentation

- **[Frontend Documentation](./frontend/README.md)** - React app setup, components, and development
- **[Backend Documentation](./backend/README.md)** - API endpoints, database schema, and server configuration
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Detailed technical implementation

---

## 🛠️ Technology Stack

### Frontend
- React 18.2
- Vite 5.1
- Framer Motion 11.0
- Recharts 2.15
- Tailwind CSS 3.4
- Axios 1.6
- jsPDF 2.5

### Backend
- Node.js
- Express
- SQLite3
- UUID

---

## 🐛 Troubleshooting

### Port Already in Use

**Frontend (5173):**
```bash
npx kill-port 5173
```

**Backend (5000):**
```bash
npx kill-port 5000
```

### Backend Connection Error

Verify backend is running:
```bash
curl http://localhost:5000/
```

Should return: `{ "status": "running", "message": "..." }`

### Dependencies Installation Error

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

This is a production-ready pharmaceutical platform. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 💡 Key Differentiators

✅ **Only platform** with dual statistical methods (LK-IMB + CIMB)  
✅ **Only platform** with real-time auto-calculation mode  
✅ **Only platform** with AI-powered analytics dashboard  
✅ **Only platform** with educational tooltips for training  
✅ **Only platform** with professional glassmorphism UI  

---

**Built with ❤️ for pharmaceutical innovation**

**Mass Balance AI** - Where Science Meets Software Excellence

---

*For questions or support, please open an issue on GitHub.*
