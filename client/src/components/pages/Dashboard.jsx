import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChartLine, FaRobot, FaExchangeAlt, FaHistory, FaList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';
import Header from './Header';
import Sidebar from './Sidebar';

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProfit: 0,
    portfolioValue: 0,
    totalTrades: 0,
    successRate: 0
  });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/dimbots?user_id=${user.id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const formattedAgents = (response.data.data || []).map(agent => ({
          ...agent,
          status: agent.status === 1 || agent.status === '1' ? 'active' : 'stopped',
          agenttype: agent.bottype === 'crypto' ? 'Crypto Trading Agent' : 'Messenger Agent',
        }));
        setAgents(formattedAgents);
        
        // Fetch additional stats (mock data for now)
        setStats({
          totalProfit: 1250.50,
          portfolioValue: 15000.00,
          totalTrades: 45,
          successRate: 82.5
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch agents');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && user?.token) fetchAgents();
    else navigate('/login');
  }, [user, navigate]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleListCryptoAgents = () => navigate('/tradebots');
  const handleListMessengerAgents = () => navigate('/cryptoSignals');

  const cryptoAgents = agents.filter(agent => agent.bottype === 'TradeBot');
  const messengerAgents = agents.filter(agent => agent.bottype === 'agent');
  
  const cryptoAgentsActive = cryptoAgents.filter(agent => agent.status === 'active').length;
  const cryptoAgentsStopped = cryptoAgents.filter(agent => agent.status === 'stopped').length;
  const messengerAgentsActive = messengerAgents.filter(agent => agent.status === 'active').length;
  const messengerAgentsStopped = messengerAgents.filter(agent => agent.status === 'stopped').length;

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
            {t('agents_dashboard')}
          </motion.h1>

          <section className="dashboard-overview">
            <h2><FaChartLine /> {t('overview')}</h2>
            <div className="overview-stats">
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>{t('total_profit')}</h3>
                <p>${stats.totalProfit.toFixed(2)}</p>
                <span className="trend positive">+12.5%</span>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>{t('portfolio_value')}</h3>
                <p>${stats.portfolioValue.toFixed(2)}</p>
                <span className="trend positive">+5.2%</span>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>{t('active_agents')}</h3>
                <p>{cryptoAgentsActive + messengerAgentsActive}</p>
                <span className="trend neutral">{t('total')}: {agents.length}</span>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3>{t('success_rate')}</h3>
                <p>{stats.successRate}%</p>
                <span className="trend positive">+2.3%</span>
              </motion.div>
            </div>
          </section>

          <section className="dashboard-agent-summary">
            <h2><FaRobot /> {t('agents_summary')}</h2>
            {loading ? (
              <div className="loading-spinner">{t('loading_agents')}</div>
            ) : error ? (
              <p className="error">{t('error')}: {error}</p>
            ) : (
              <div className="agent-summary-container">
                <motion.div 
                  className="agent-summary-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3><FaRobot /> {t('crypto_signal_agents')}</h3>
                  <div className="agent-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('total')}</span>
                      <span className="stat-value">{messengerAgents.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('active')}</span>
                      <span className="stat-value active">{messengerAgentsActive}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('stopped')}</span>
                      <span className="stat-value stopped">{messengerAgentsStopped}</span>
                    </div>
                  </div>
                  <div className="agent-buttons">
                    <motion.button 
                      className="btn-primary"
                      onClick={handleListMessengerAgents}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaList /> {t('manage')}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div 
                  className="agent-summary-card"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3><FaExchangeAlt /> {t('crypto_trading_agents')}</h3>
                  <div className="agent-stats">
                    <div className="stat-item">
                      <span className="stat-label">{t('total')}</span>
                      <span className="stat-value">{cryptoAgents.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('active')}</span>
                      <span className="stat-value active">{cryptoAgentsActive}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">{t('stopped')}</span>
                      <span className="stat-value stopped">{cryptoAgentsStopped}</span>
                    </div>
                  </div>
                  <div className="agent-buttons">
                    <motion.button 
                      className="btn-primary"
                      onClick={handleListCryptoAgents}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaList /> {t('manage')}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </section>

          <section className="dashboard-history">
            <h2><FaHistory /> {t('recent_activity')}</h2>
            <div className="history-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>{t('date')}</th>
                    <th>{t('agent')}</th>
                    <th>{t('type')}</th>
                    <th>{t('action')}</th>
                    <th>{t('details')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2023-12-15 09:30</td>
                    <td>TrendFollower #1</td>
                    <td>{t('crypto')}</td>
                    <td>{t('buy')}</td>
                    <td>{t('bought')} 0.15 BTC {t('at')} $42,650</td>
                  </tr>
                  <tr>
                    <td>2023-12-15 08:45</td>
                    <td>AlertAgent #3</td>
                    <td>{t('signal')}</td>
                    <td>{t('alert')}</td>
                    <td>ETH {t('broke_resistance')} {t('at')} $2,250</td>
                  </tr>
                  <tr>
                    <td>2023-12-14 14:22</td>
                    <td>TrendFollower #2</td>
                    <td>{t('crypto')}</td>
                    <td>{t('sell')}</td>
                    <td>{t('sold')} 12.5 XRP {t('at')} $0.65</td>
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