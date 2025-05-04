# Psychologist Agent Platform

A comprehensive psychology and educational platform providing personality assessments and educational tools.

## 🌟 Features

### 1. Personality Tests
- **DISC Assessment**
  - Adult DISC personality test
  - Children's DISC test (CH-DISC)
  - Detailed personality analysis
  - Historical result tracking

### 2. Educational Quizzes
- **Math Quizzes**
  - Progressive difficulty levels
  - Real-time scoring
  - Performance analytics
- **Custom Quiz Builder**
  - Create personalized quizzes
  - Multiple question types
  - Score tracking

### 3. User Management
- Secure authentication (JWT)
- Social login integration
  - Google OAuth
  - MetaMask
- User profile management
- Role-based access control

### 4. Dashboard
- Test history visualization
- Progress tracking
- Performance analytics
- Personalized recommendations

### 5. Advanced Features
- Multi-language support
- Responsive design
- Real-time updates
- Data export capabilities

## 🛠️ Technology Stack

### Frontend
- React.js
- Redux for state management
- Material-UI components
- Chart.js for analytics
- i18next for localization

### Backend
- Node.js
- Express.js
- PostgreSQL database
- JWT authentication
- RESTful API design

### DevOps & Tools
- Docker containerization
- Git version control
- ESLint code quality
- Jest for testing

## 📁 Project Structure

```
project-root/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── services/      # API services
│   └── public/            # Static files
├── backend/               # Node.js server
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/psychologist-agent.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Configure environment variables:
```bash
cp .env.example .env
```

5. Start the development servers:
```bash
# Backend
npm run dev

# Frontend (in a new terminal)
cd client
npm start
```

## 🔒 Security Features

- JWT authentication
- Password encryption
- Rate limiting
- CORS protection
- Input validation
- XSS protection
- CSRF tokens

## 📱 Supported Platforms

- Web browsers (Chrome, Firefox, Safari)
- Mobile responsive design
- PWA support

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Authors

- **KAMRAN HADADMARANDI** - *Initial work* - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

---

For more information, please visit our [documentation](docs/index.md).