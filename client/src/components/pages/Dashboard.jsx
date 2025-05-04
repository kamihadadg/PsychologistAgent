import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaStar, FaHistory, FaList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import Header from './Header';
import Sidebar from './Sidebar';

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProgress: 0,
    quizzesCompleted: 0,
    activeSubjects: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError(null);
        // Mock data for progress (replace with actual API call if available)
        const mockProgress = [
          {
            id: 1,
            type: 'psychological',
            name: 'Emotional Awareness',
            total: 10,
            completed: 8,
            status: 'active',
          },
          {
            id: 2,
            type: 'psychological',
            name: 'Confidence Building',
            total: 12,
            completed: 6,
            status: 'active',
          },
          {
            id: 3,
            type: 'academic',
            name: 'Math',
            total: 15,
            completed: 12,
            status: 'active',
          },
          {
            id: 4,
            type: 'academic',
            name: 'Science',
            total: 10,
            completed: 7,
            status: 'active',
          },
        ];
        setProgress(mockProgress);

        // Mock stats data
        setStats({
          totalProgress: 75.5,
          quizzesCompleted: 33,
          activeSubjects: 4,
          averageScore: 82,
        });
      } catch (err) {
        setError('Failed to fetch progress');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user?.token) fetchProgress();
    else navigate('/login');
  }, [user, navigate]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleListQuizzes = (type) => navigate(`/quizzes/${type}`);

  const psychProgress = progress.filter((item) => item.type === 'psychological');
  const academicProgress = progress.filter((item) => item.type === 'academic');
  const psychCompleted = psychProgress.reduce((sum, item) => sum + item.completed, 0);
  const academicCompleted = academicProgress.reduce((sum, item) => sum + item.completed, 0);

  return (
    <div className="dashboard-wrapper" dir={i18n.dir()}>
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('dashboard')}
          </motion.h1>

          <section className="dashboard-overview">
            <h2>
              <FaStar /> {t('overview')}
            </h2>
            <div className="overview-stats">
              <motion.div
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3>{t('total_progress')}</h3>
                <p>{stats.totalProgress.toFixed(1)}%</p>
                <span className="trend positive">+5.2%</span>
              </motion.div>
              <motion.div
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3>{t('quiz_completed')}</h3>
                <p>{stats.quizzesCompleted}</p>
                <span className="trend neutral">{t('total')}: 40</span>
              </motion.div>
              <motion.div
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3>{t('active_subjects')}</h3>
                <p>{stats.activeSubjects}</p>
                <span className="trend neutral">{t('total')}: 6</span>
              </motion.div>
              <motion.div
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3>{t('success_rate')}</h3>
                <p>{stats.averageScore}%</p>
                <span className="trend positive">+3.5%</span>
              </motion.div>
            </div>
          </section>

          <section className="dashboard-progress">
            <h2>
              <FaBook /> {t('progress')}
            </h2>
            {loading ? (
              <div className="loading-spinner">{t('common.loading')}</div>
            ) : error ? (
              <p className="error">{t('error')}: {error}</p>
            ) : (
              <div className="progress-container">
                <motion.div
                  className="progress-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3>
                    <FaBook /> {t('psychological_tests')}
                  </h3>
                  <div className="progress-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('total')}</span>
                      <span className="stat-value">{psychProgress.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('completed')}</span>
                      <span className="stat-value">{psychCompleted}</span>
                    </div>
                  </div>
                  <div className="progress-buttons">
                    <motion.a
                      href="/quizzes/psychological"
                      className="btn-primary"
                      onClick={() => handleListQuizzes('psychological')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaList /> {t('manage')}
                    </motion.a>
                  </div>
                </motion.div>

                <motion.div
                  className="progress-card"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3>
                    <FaBook /> {t('academic_quizzes')}
                  </h3>
                  <div className="progress-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('total')}</span>
                      <span className="stat-value">{academicProgress.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('completed')}</span>
                      <span className="stat-value">{academicCompleted}</span>
                    </div>
                  </div>
                  <div className="progress-buttons">
                    <motion.a
                      href="/quizzes/academic"
                      className="btn-primary"
                      onClick={() => handleListQuizzes('academic')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaList /> {t('manage')}
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            )}
          </section>

          <section className="dashboard-history">
            <h2>
              <FaHistory /> {t('recent_activity')}
            </h2>
            <div className="history-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{t('date')}</th>
                    <th>{t('quiz')}</th>
                    <th>{t('type')}</th>
                    <th>{t('action')}</th>
                    <th>{t('details')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2025-05-04 10:15</td>
                    <td>Math Quiz #3</td>
                    <td>{t('math')}</td>
                    <td>{t('completed')}</td>
                    <td>
                      {t('score')}: <span className="score high">92%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>2025-05-03 14:30</td>
                    <td>Emotional Awareness</td>
                    <td>{t('psychological')}</td>
                    <td>{t('completed')}</td>
                    <td>
                      {t('score')}: <span className="score high">85%</span>
                    </td>
                  </tr>
                  <tr>
                    <td>2025-05-02 09:45</td>
                    <td>Science Quiz #2</td>
                    <td>{t('science')}</td>
                    <td>{t('completed')}</td>
                    <td>
                      {t('score')}: <span className="score low">68%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;