# AI Health Predictor & Diagnostic System

A sophisticated AI-powered health diagnostic application that provides personalized health assessments, clinical interviews, and detailed reports.

## 🚀 Features

- **AI-Powered Diagnostics**: Deep analysis of symptoms and health history.
- **Interactive Clinical Interview**: A dynamic AI-driven questioning system.
- **Multilingual Support**: Available in English and Hindi.
- **Professional PDF Reports**: Export your assessment results into a branded PDF.
- **Responsive Design**: Premium UI/UX with glassmorphism and dynamic gradients.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js
- **Styling**: TailwindCSS & Framer Motion
- **Tooling**: Vite

### Backend
- **Language**: Python
- **Framework**: FastAPI / Flask (depends on your implementation)
- **AI Engine**: Google Gemini API

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Clone the repository
```bash
git clone https://github.com/ashirwad-codes/ai-health-predictor.git
cd ai-health-predictor
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# Create .env and add your GEMINI_API_KEY
python main.py
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📄 License
This project is licensed under the MIT License.
