# 💕 Love Compatibility Calculator

A fun, beautiful web app that calculates compatibility scores between two people using **Fully Homomorphic Encryption (FHE)** from Zama's Concrete library. Your private answers are never revealed - not even to the server!

![Love Calculator](https://img.shields.io/badge/FHE-Powered-ff6b9d?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge)

## 🔐 How FHE Works

Fully Homomorphic Encryption allows computations to be performed on encrypted data without ever decrypting it:

1. **Person A** answers 10 questions → answers are encrypted on their device
2. **Person B** answers the same questions → answers are encrypted on their device
3. **Server** computes compatibility score ON ENCRYPTED DATA
4. Only the final score is decrypted - individual answers remain secret forever!

## ✨ Features

- 🔒 **Privacy-First**: Your answers are encrypted and never revealed
- 💖 **Beautiful UI**: Modern, romantic theme with smooth animations
- 📱 **Mobile Responsive**: Works on all devices
- 🎉 **Celebration Effects**: Confetti animation for high scores
- 🔗 **Easy Sharing**: Generate unique session codes to share with partner

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
cd "Compatibility Calculator"

# Start with Docker Compose
docker-compose up --build

# Access the app at http://localhost:3000
```

### Manual Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000
```

## 📁 Project Structure

```
Compatibility Calculator/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI endpoints
│   │   ├── fhe_engine.py    # Concrete FHE logic
│   │   └── models.py        # Pydantic models
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── hooks/           # Custom hooks
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🎯 How to Use

1. **Create Session**: Enter your name and get a unique session code
2. **Share Code**: Send the code to your partner
3. **Answer Questions**: Both of you answer 10 fun questions privately
4. **See Result**: Get your compatibility score without revealing answers!

## 📋 The 10 Questions

1. 🏔️ How important is adventure in your life?
2. 🤝 How do you handle conflicts?
3. 🌙 Are you a morning person or night owl?
4. 🧘 How important is alone time to you?
5. 🎉 Ideal weekend: Party or Netflix?
6. ✨ How spontaneous are you?
7. 💪 How important is physical fitness?
8. 💕 How do you express love?
9. 💰 How important is financial stability?
10. 👥 How social are you?

## 🧮 Compatibility Algorithm

The algorithm is simple but computed on encrypted data:

```python
# Calculate absolute difference for each question
total_diff = sum(abs(a - b) for a, b in zip(answers_a, answers_b))

# Convert to percentage
score = 100 - (total_diff * 100 / max_possible_diff)
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/questions` | GET | Get list of questions |
| `/api/session/create` | POST | Create new session |
| `/api/session/join` | POST | Join existing session |
| `/api/answers/submit` | POST | Submit encrypted answers |
| `/api/session/{code}/status` | GET | Get session status |
| `/api/session/{code}/result` | GET | Get compatibility result |

## 🛠️ Tech Stack

- **Backend**: Python, FastAPI, Zama Concrete (FHE)
- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Deployment**: Docker, Nginx

## 📜 License

MIT License - Feel free to use and modify!

## 🙏 Credits

- [Zama](https://zama.ai/) for the amazing Concrete FHE library
- Built with 💕 for demonstrating FHE in a fun way!

---

**Made with 💕 and 🔐 FHE**
