import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // اضافه کردن useNavigate
import './DISC.css';
import questionData from '../Qu.json';

const DISC = () => {
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
  const navigate = useNavigate(); // برای ناوبری

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
      D: "سلطه‌جو (Dominance): شما قاطع، مستقل و مصمم هستید. به نتایج اهمیت می‌دهید و از چالش‌ها استقبال می‌کنید. رهبری و تصمیم‌گیری سریع از ویژگی‌های شماست.",
      I: "تأثیرگذار (Influence): شما اجتماعی، ارتباطی و خوش‌بین هستید. توانایی متقاعدسازی و الهام‌بخشی به دیگران را دارید و از کار با افراد مختلف لذت می‌برید.",
      S: "ثبات‌دهنده (Steadiness): شما صبور، قابل‌اعتماد و هماهنگ‌کننده هستید. به روابط پایدار اهمیت می‌دهید و در محیط‌های با ثبات بهترین عملکرد را دارید.",
      C: "وظیفه‌شناس (Conscientiousness): شما دقیق، تحلیلی و منظم هستید. به کیفیت و استانداردهای بالا اهمیت می‌دهید و با داده‌ها و جزئیات به خوبی کار می‌کنید."
    };

    return (
      <div className="personality-description">
        <h3 className="text-xl font-bold mb-2">سبک اصلی: {descriptions[results.primary]}</h3>
        <h3 className="text-lg font-bold mb-4">سبک ثانویه: {descriptions[results.secondary]}</h3>
        <p>
          ترکیب سبک‌های {results.primary} و {results.secondary} نشان‌دهنده شخصیتی است که هم ویژگی‌های 
          {results.primary === 'D' ? ' قاطعیت و رهبری' : 
           results.primary === 'I' ? ' اجتماعی و تاثیرگذاری' : 
           results.primary === 'S' ? ' ثبات و هماهنگی' : 
           ' دقت و نظم'} و هم خصوصیات 
          {results.secondary === 'D' ? ' قاطعیت و رهبری' : 
           results.secondary === 'I' ? ' اجتماعی و تاثیرگذاری' : 
           results.secondary === 'S' ? ' ثبات و هماهنگی' : 
           ' دقت و نظم'} را دارد.
        </p>
      </div>
    );
  };

  const getDetailedAnalysis = () => {
    if (!results) return null;

    const detailedDescriptions = {
      D: "به‌عنوان یک فرد سلطه‌جو، شما در موقعیت‌های رقابتی و پرفشار می‌درخشید. توانایی شما در تصمیم‌گیری سریع و هدایت تیم‌ها به سمت اهداف بزرگ، شما را به یک رهبر طبیعی تبدیل می‌کند. توصیه: روی گوش دادن فعال به نظرات دیگران و مدیریت استرس تمرکز کنید تا تعادل بهتری در روابط کاری ایجاد شود.",
      I: "شما به‌عنوان یک فرد تأثیرگذار، انرژی مثبت و ارتباطات قوی را به محیط کار می‌آورید. مهارت شما در الهام‌بخشی و متقاعدسازی، تیم‌ها را متحد می‌کند. توصیه: روی مدیریت زمان و تمرکز بر جزئیات کار کنید تا ایده‌هایتان به نتایج ملموس منجر شوند.",
      S: "شما به‌عنوان یک فرد ثبات‌دهنده، صبور و قابل‌اعتماد هستید و به ایجاد محیط‌های هماهنگ کمک می‌کنید. مهارت شما در حمایت از دیگران، روابط پایداری می‌سازد. توصیه: گاهی اوقات از منطقه امن خود خارج شوید و با تغییرات سریع‌تر سازگار شوید.",
      C: "شما به‌عنوان یک فرد وظیفه‌شناس، دقیق و تحلیلی هستید و به کیفیت و استانداردهای بالا اهمیت می‌دهید. توانایی شما در تحلیل داده‌ها و برنامه‌ریزی، نتایج قابل‌اعتمادی به همراه دارد. توصیه: انعطاف‌پذیری بیشتری در برابر تغییرات غیرمنتظره نشان دهید و ارتباطات خود را تقویت کنید."
    };

    return (
      <div className="detailed-analysis">
        <h3 className="text-xl font-bold mb-4">آنالیز تفصیلی سبک شخصیتی شما</h3>
        <div className="mb-4">
          <h4 className="text-lg font-bold">سبک اصلی: {results.primary}</h4>
          <p>{detailedDescriptions[results.primary]}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-lg font-bold">سبک ثانویه: {results.secondary}</h4>
          <p>{detailedDescriptions[results.secondary]}</p>
        </div>
        <p className="italic">این تحلیل به شما کمک می‌کند تا نقاط قوت خود را بهتر بشناسید و در مسیر رشد حرفه‌ای و شخصی قدم بردارید.</p>
      </div>
    );
  };

  if (showIntro) {
    return (
      <div className="container">
        <div className="intro-section">
          <h1 className="text-2xl font-bold mb-4">معرفی آزمون شخصیت‌شناسی DISC</h1>
          <p className="text-gray-600 mb-4">
            آزمون DISC یک ابزار حرفه‌ای برای شناسایی سبک‌های شخصیتی است که به شما کمک می‌کند ویژگی‌های کلیدی خود را در محیط‌های کاری و شخصی بهتر درک کنید. این آزمون شامل 32 سؤال است که در 4 دسته اصلی (سلطه‌جو، تأثیرگذار، ثبات‌دهنده، وظیفه‌شناس) و سؤالات کنترلی طراحی شده‌اند. شما باید به هر سؤال با انتخاب گزینه‌ای بین 1 (کاملاً مخالفم) تا 5 (کاملاً موافقم) پاسخ دهید. کل آزمون حدود 5 تا 10 دقیقه طول می‌کشد.
          </p>
          <p className="text-gray-600 mb-6">
            نتایج این آزمون به شما نشان می‌دهد که کدام سبک شخصیتی در شما غالب است و چگونه می‌توانید از نقاط قوت خود در زندگی حرفه‌ای و شخصی استفاده کنید.
          </p>
          <div className="button-group">
            <button
              onClick={() => setShowIntro(false)}
              className="next-button"
            >
              شروع آزمون
            </button>
            <button
              onClick={() => navigate('/dashboard')} // ریدایرکت به داشبورد
              className="prev-button"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div>در حال بارگذاری سؤالات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      {!isCompleted ? (
        <>
          <div className="mb-6">
            <h1>آزمون شخصیت‌شناسی DISC</h1>
            <p className="text-gray-600">لطفاً به هر سؤال با انتخاب یک گزینه بین 1 (کاملاً مخالفم) تا 5 (کاملاً موافقم) پاسخ دهید.</p>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progressPercentage()}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {Object.keys(answers).length} از {questions.length} سؤال ({progressPercentage()}%)
            </div>
          </div>

          <div className="mb-6">
            {getCurrentQuestions().map((question) => (
              <div key={question.id} className="question-card">
                <div className="flex items-start mb-2">
                  <span className="question-number">{question.id}.</span>
                  <p>{question.text}</p>
                </div>
                <div className="radio-group">
                  <span>کاملاً مخالفم</span>
                  <div className="radio-options">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="radio-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => handleAnswer(question.id, value)}
                          className="radio-input"
                        />
                        <span className={`radio-button ${answers[question.id] === value ? 'selected' : ''}`}>
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                  <span>کاملاً موافقم</span>
                </div>
              </div>
            ))}
          </div>

          <div className="button-group">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="prev-button"
            >
              قبلی
            </button>

            {currentPage * questionsPerPage >= questions.length ? (
              <button
                onClick={calculateResults}
                disabled={!isCurrentPageComplete()}
                className="submit-button"
              >
                مشاهده نتایج
              </button>
            ) : (
              <button
                onClick={nextPage}
                disabled={!isCurrentPageComplete()}
                className="next-button"
              >
                بعدی
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="results-container">
          <h2>نتایج آزمون DISC</h2>

          {controlScore > 30 && (
            <div className="alert">
              <p className="font-bold">توجه:</p>
              <p>امتیاز شما در سؤالات کنترلی بالاست. ممکن است پاسخ‌های شما بیش از حد ایده‌آل بوده باشند.</p>
            </div>
          )}

          <div className="score-grid">
            {Object.keys(results.scores).map((category) => (
              <div key={category} className="score-card">
                <h3>{category}</h3>
                <div className="score-bar">
                  <div
                    style={{ width: `${results.scores[category]}%` }}
                    className={`score-bar-fill ${category}`}
                  >
                    {results.scores[category]}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getPersonalityDescription()}

          {!showAnalysis ? (
            <div className="analysis-prompt">
              <h3 className="text-lg font-bold mb-4">آیا می‌خواهید آنالیز تفصیلی‌تری از نتایج خود ببینید؟</h3>
              <div className="button-group">
                <button
                  onClick={() => {
                    setShowAnalysis(true);
                    saveToHistory(results);
                  }}
                  className="next-button"
                >
                  بله، آنالیز بیشتر
                </button>
                <button
                  onClick={() => {
                    setAnswers({});
                    setIsCompleted(false);
                    setResults(null);
                    setCurrentPage(1);
                    setQuestions(getRandomQuestions(questionData, 8, 8));
                  }}
                  className="prev-button"
                >
                  خیر، شروع مجدد
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
                  className="restart-button"
                >
                  شروع مجدد آزمون
                </button>
              </div>
            </>
          )}

          <div className="history-section mt-8">
            <h3 className="text-xl font-bold mb-4">تاریخچه نتایج شما</h3>
            {history.length > 0 ? (
              <ul className="history-list">
                {history.map((entry, index) => (
                  <li key={index} className="history-item">
                    <p><strong>زمان:</strong> {entry.timestamp}</p>
                    <p><strong>سبک اصلی:</strong> {entry.primary}</p>
                    <p><strong>سبک ثانویه:</strong> {entry.secondary}</p>
                    <p><strong>امتیازات:</strong> D: {entry.scores.D}%, I: {entry.scores.I}%, S: {entry.scores.S}%, C: {entry.scores.C}%</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>هنوز نتیجه‌ای ذخیره نشده است.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DISC;