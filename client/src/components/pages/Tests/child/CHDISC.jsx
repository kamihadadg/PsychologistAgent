import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CHDISC.css';
import questionData from './CHQu.json';
import Sidebar from '../../Sidebar';

const CHDISC = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [controlScore, setControlScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const questionsPerPage = 3;

  // لود تاریخچه از localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('discHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // ذخیره تاریخچه در localStorage
  const saveToHistory = (result) => {
    const timestamp = new Date().toLocaleString('fa-IR');
    const newEntry = { ...result, timestamp };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('discHistory', JSON.stringify(updatedHistory));
  };

  // انتخاب تصادفی سؤالات
  const getRandomQuestions = (data, countPerCategory, controlCount) => {
    const categories = ['D', 'I', 'S', 'C'];
    let selectedQuestions = [];

    categories.forEach(category => {
      const categoryQuestions = data.filter(q => q.category === category && !q.is_control);
      const shuffled = categoryQuestions.sort(() => 0.5 - Math.random());
      selectedQuestions = selectedQuestions.concat(shuffled.slice(0, countPerCategory));
    });

    const controlQuestions = data.filter(q => q.is_control);
    const shuffledControl = controlQuestions.sort(() => 0.5 - Math.random());
    selectedQuestions = selectedQuestions.concat(shuffledControl.slice(0, controlCount));

    return selectedQuestions.sort(() => 0.5 - Math.random());
  };

  // لود سؤالات تصادفی
  useEffect(() => {
    if (!showIntro) {
      try {
        const selectedQuestions = getRandomQuestions(questionData, 7, 0);
        setQuestions(selectedQuestions);
        setLoading(false);
      } catch (err) {
        console.error("Error loading JSON file:", err);
        setError("خطا در بارگذاری سؤالات");
        setLoading(false);
      }
    }
  }, [showIntro]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const nextPage = () => {
    if (currentPage * questionsPerPage < questions.length) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const calculateResults = () => {
    let controlQuestions = questions.filter(q => q.is_control);
    let controlTotal = 0;

    controlQuestions.forEach(q => {
      if (answers[q.id]) {
        controlTotal += answers[q.id];
      }
    });

    setControlScore(controlTotal);

    const categories = {
      D: { total: 0, max: 0 },
      I: { total: 0, max: 0 },
      S: { total: 0, max: 0 },
      C: { total: 0, max: 0 }
    };

    questions.forEach(q => {
      if (!q.is_control && q.category in categories) {
        categories[q.category].max += q.weight * 5;
        if (answers[q.id]) {
          categories[q.category].total += answers[q.id] * q.weight;
        }
      }
    });

    const percentages = {};
    Object.keys(categories).forEach(key => {
      percentages[key] = Math.round((categories[key].total / categories[key].max) * 100);
    });

    const sortedCategories = Object.keys(percentages).sort((a, b) => percentages[b] - percentages[a]);

    const result = {
      scores: percentages,
      primary: sortedCategories[0],
      secondary: sortedCategories[1],
      controlScore: controlTotal
    };

    setResults(result);
    setIsCompleted(true);
  };

  const getCurrentQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return questions.slice(startIndex, endIndex);
  };

  const isCurrentPageComplete = () => {
    const currentQuestions = getCurrentQuestions();
    return currentQuestions.every(q => answers[q.id] !== undefined);
  };

  const progressPercentage = () => {
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  const getPersonalityDescription = () => {
    if (!results) return null;

    const descriptions = {
      D: "سلطه‌جو (Dominance): تو یه رهبر شجاع و پر انرژی هستی! دوست داری کارهای جدید رو امتحان کنی و همیشه آماده چالش‌ها هستی.",
      I: "تأثیرگذار (Influence): تو خیلی شاد و دوست‌داشتنی هستی! عاشق صحبت کردن با دوستات هستی و همیشه می‌تونی همه رو بخندونی.",
      S: "ثبات‌دهنده (Steadiness): تو یه دوست مهربون و آرام هستی! همیشه به دوستات کمک می‌کنی و دوست داری همه چیز مرتب باشه.",
      C: "وظیفه‌شناس (Conscientiousness): تو خیلی باهوش و دقیق هستی! دوست داری همه چیز رو خوب یاد بگیری و کارها رو درست انجام بدی."
    };

    return (
      <div className="chdisc-personality-description">
        {/* <Sidebar /> */}
        <h3 className="chdisc-h3">سبک اصلی تو: {descriptions[results.primary]}</h3>
        <h3 className="chdisc-h3">سبک دوم تو: {descriptions[results.secondary]}</h3>
        <p className="chdisc-p">
          تو یه ترکیب فوق‌العاده از {results.primary} و {results.secondary} هستی! این یعنی تو هم 
          {results.primary === 'D' ? ' شجاع و رهبر' : 
           results.primary === 'I' ? ' شاد و دوست‌داشتنی' : 
           results.primary === 'S' ? ' مهربون و آرام' : 
           ' باهوش و دقیق'} هستی و هم 
          {results.secondary === 'D' ? ' شجاع و رهبر' : 
           results.secondary === 'I' ? ' شاد و دوست‌داشتنی' : 
           results.secondary === 'S' ? ' مهربون و آرام' : 
           ' باهوش و دقیق'}!
        </p>
      </div>
    );
  };

  const getDetailedAnalysis = () => {
    if (!results) return null;

    const detailedDescriptions = {
      D: "تو مثل یه قهرمان شجاع هستی که همیشه آماده ماجراجویی‌های جدیده! تو می‌تونی بقیه رو هدایت کنی و ایده‌های بزرگ داشته باشی. فقط یادت باشه گاهی به حرف دوستات هم گوش کنی تا همه با هم خوشحال باشین!",
      I: "تو مثل یه ستاره درخشان تو جمع دوستات هستی! همه از انرژی و خنده‌هات لذت می‌برن. فقط یه کم روی برنامه‌ریزی کارات تمرکز کن تا همه چیز بهتر بشه!",
      S: "تو مثل یه دوست وفادار و مهربون هستی که همیشه به بقیه کمک می‌کنه. تو باعث می‌شی همه احساس آرامش کنن. فقط گاهی یه چیز جدید رو امتحان کن، شاید خیلی باحال باشه!",
      C: "تو مثل یه دانشمند باهوش و دقیق هستی! همیشه دوست داری همه چیز رو درست و کامل انجام بدی. فقط یه کم با دوستات بیشتر بازی کن و نگران جزئیات نباش!"
    };

    return (
      <div className="chdisc-detailed-analysis">
        {/* <Sidebar /> */}
        <h3 className="chdisc-h3">یه نگاه دقیق‌تر به شخصیت تو</h3>
        <div className="mb-4">
          <h4 className="chdisc-h4">سبک اصلی: {results.primary}</h4>
          <p className="chdisc-p">{detailedDescriptions[results.primary]}</p>
        </div>
        <div className="mb-4">
          <h4 className="chdisc-h4">سبک دوم: {results.secondary}</h4>
          <p className="chdisc-p">{detailedDescriptions[results.secondary]}</p>
        </div>
        <p className="chdisc-p italic">این تحلیل به تو کمک می‌کنه خودتو بهتر بشناسی و با دوستات و خانواده‌ات بیشتر خوش بگذرونی!</p>
      </div>
    );
  };

  if (showIntro) {
    return (
      <div className="chdisc-wrapper">
        <div className="chdisc-container">
          <div className="chdisc-intro-section">
            <h1 className="chdisc-h1">بیا خودتو بهتر بشناسی!</h1>
            <p className="chdisc-p text-gray-600 mb-4">
              این یه بازی باحاله که بهت کمک می‌کنه بفهمی چه جور آدمی هستی! فقط باید به چندتا سؤال جواب بدی و بگی چقدر باهاشون موافقی. از 1 (اصلاً موافق نیستم) تا 5 (خیلی موافقم) انتخاب کن. این بازی فقط چند دقیقه طول می‌کشه!
            </p>
            <p className="chdisc-p text-gray-600 mb-6">
              وقتی تموم شد، می‌فهمی چه ویژگی‌های باحالی داری و چطور می‌تونی با دوستات و خانواده‌ات بهتر بازی کنی!
            </p>
            <div className="chdisc-button-group">
              <button
                onClick={() => setShowIntro(false)}
                className="chdisc-next-button"
              >
                بریم شروع کنیم!
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="chdisc-prev-button"
              >
                نه، بریم عقب
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chdisc-wrapper">
        <div className="chdisc-loading">
          <div>داریم سؤال‌ها رو آماده می‌کنیم...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chdisc-wrapper">
        <div className="chdisc-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chdisc-wrapper">
      <div className="chdisc-container">
        {/* <Sidebar /> */}
        {!isCompleted ? (
          <>
            <div className="mb-6">
              <h1 className="chdisc-h1">بازی شخصیت‌شناسی DISC</h1>
              <p className="chdisc-p text-gray-600">به هر سؤال یه جواب بده و بگو چقدر باهاش موافقی! از 1 (اصلاً موافق نیستم) تا 5 (خیلی موافقم).</p>
              <div className="chdisc-progress-bar">
                <div 
                  className="chdisc-progress-bar-fill" 
                  style={{ width: `${progressPercentage()}%` }}
                ></div>
              </div>
              <div className="chdisc-progress-text">
                {Object.keys(answers).length} از {questions.length} سؤال ({progressPercentage()}%)
              </div>
            </div>

            <div className="mb-6">
              {getCurrentQuestions().map((question) => (
                <div key={question.id} className="chdisc-question-card">
                  <div className="flex items-start mb-2">
                    <span className="chdisc-question-number">{question.id}.</span>
                    <p className="chdisc-p">{question.text}</p>
                  </div>
                  <div className="chdisc-radio-group">
                    <span>اصلاً موافق نیستم</span>
                    <div className="chdisc-radio-options">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="chdisc-radio-label">
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={value}
                            checked={answers[question.id] === value}
                            onChange={() => handleAnswer(question.id, value)}
                            className="chdisc-radio-input"
                          />
                          <span className={`chdisc-radio-button ${answers[question.id] === value ? 'selected' : ''}`}>
                            {value}
                          </span>
                        </label>
                      ))}
                    </div>
                    <span>خیلی موافقم</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="chdisc-button-group">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="chdisc-prev-button"
              >
                قبلی
              </button>

              {currentPage * questionsPerPage >= questions.length ? (
                <button
                  onClick={calculateResults}
                  disabled={!isCurrentPageComplete()}
                  className="chdisc-submit-button"
                >
                  ببینیم چی شد!
                </button>
              ) : (
                <button
                  onClick={nextPage}
                  disabled={!isCurrentPageComplete()}
                  className="chdisc-next-button"
                >
                  بعدی
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="chdisc-results-container">
            <h2 className="chdisc-h2">نتیجه‌های تو!</h2>

            {controlScore > 30 && (
              <div className="chdisc-alert">
                <p className="chdisc-p font-bold">یه لحظه صبر کن!</p>
                <p className="chdisc-p">شاید جواب‌هات یه کم زیادی عالی بودن! یه بار دیگه امتحان کن!</p>
              </div>
            )}

            <div className="chdisc-score-grid">
              {Object.keys(results.scores).map((category) => (
                <div key={category} className="chdisc-score-card">
                  <h3 className="chdisc-h3">{category}</h3>
                  <div className="chdisc-score-bar">
                    <div
                      style={{ width: `${results.scores[category]}%` }}
                      className={`chdisc-score-bar-fill ${category}`}
                    >
                      {results.scores[category]}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {getPersonalityDescription()}

            {!showAnalysis ? (
              <div className="chdisc-analysis-prompt">
                <h3 className="chdisc-h3">دوست داری بیشتر درباره خودت بدونی؟</h3>
                <div className="chdisc-button-group">
                  <button
                    onClick={() => {
                      setShowAnalysis(true);
                      saveToHistory(results);
                    }}
                    className="chdisc-next-button"
                  >
                    آره، بگو!
                  </button>
                  <button
                    onClick={() => {
                      setAnswers({});
                      setIsCompleted(false);
                      setResults(null);
                      setCurrentPage(1);
                      setQuestions(getRandomQuestions(questionData, 8, 8));
                    }}
                    className="chdisc-prev-button"
                  >
                    نه، دوباره بازی کنیم!
                  </button>
                </div>
              </div>
            ) : (
              <>
                {getDetailedAnalysis()}
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setAnswers({});
                      setIsCompleted(false);
                      setResults(null);
                      setCurrentPage(1);
                      setShowAnalysis(false);
                      setQuestions(getRandomQuestions(questionData, 8, 8));
                    }}
                    className="chdisc-restart-button"
                  >
                    دوباره بازی کنیم!
                  </button>
                </div>
              </>
            )}

            <div className="chdisc-history-section mt-8">
              <h3 className="chdisc-h3">دفعات قبل تو چی بودی؟</h3>
              {history.length > 0 ? (
                <ul className="chdisc-history-list">
                  {history.map((entry, index) => (
                    <li key={index} className="chdisc-history-item">
                      <p className="chdisc-p"><strong>زمان:</strong> {entry.timestamp}</p>
                      <p className="chdisc-p"><strong>سبک اصلی:</strong> {entry.primary}</p>
                      <p className="chdisc-p"><strong>سبک دوم:</strong> {entry.secondary}</p>
                      <p className="chdisc-p"><strong>امتیازات:</strong> D: {entry.scores.D}%, I: {entry.scores.I}%, S: {entry.scores.S}%, C: {entry.scores.C}%</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="chdisc-p">هنوز هیچ نتیجه‌ای نداری! بیا یه بار دیگه بازی کنیم!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CHDISC;