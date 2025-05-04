import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import './i18n';
import './components/LanguageSwitcher.css';

import Dashboard from './components/pages/Dashboard';

import Login from './components/auth/Login';
import Home from './components/pages/Home';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Register from './components/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './components/pages/Profile';



import Security from './components/pages/Security';
import DISC from './components/pages/Tests/Adult/DISC';
import CHDISC from './components/pages/Tests/child/CHDISC';

import MathQuiz from './components/pages/Quiz/Math/MathQuiz';


const MathQuizWrapper = () => {
  const { quizId } = useParams();
  return <MathQuiz quizId={parseInt(quizId || '1')} />;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>

      
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
        
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
            
            <Route path="/DISC"   element={<ProtectedRoute> <DISC />   </ProtectedRoute> } />

            <Route path="/CHDISC"   element={<ProtectedRoute> <CHDISC />   </ProtectedRoute> } />
            
            <Route path="/MathQuiz/:quizId"   element={<ProtectedRoute> <MathQuizWrapper />   </ProtectedRoute> } />
            
            
            
            <Route path="/profile"   element={<ProtectedRoute> <Profile />   </ProtectedRoute> } />
            <Route path="/security"   element={<ProtectedRoute> <Security />   </ProtectedRoute> } />

            
            <Route path="/signup" element={<Register />} />
          </Routes>
        </div>
      </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;