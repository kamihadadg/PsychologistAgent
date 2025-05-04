import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './MathQuiz.css';
import Sidebar from '../../Sidebar';

const MathQuiz = ({ quizId }) => {
  const { t, i18n } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false); // State for toggling review section
  const navigate = useNavigate();

  // Use default quizId of 1 if invalid
  const effectiveQuizId = quizId && !isNaN(quizId) && quizId >= 1 ? quizId : 1;

  const questionsPerPage = 3;
  const questionsToSelect = 20; // Number of questions to randomly select

  // Function to shuffle array and select a subset
  const selectRandomQuestions = (array, count) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (!showIntro) {
      const loadQuestions = async () => {
        try {
          setLoading(true);
          // Dynamically import the question file based on effectiveQuizId
          const questionModule = await import(`./MathQuestions${effectiveQuizId}.json`);
          const loadedQuestions = questionModule.default || questionModule;
          if (!loadedQuestions.length) {
            throw new Error('No questions found');
          }
          // Select 20 random questions
          setQuestions(selectRandomQuestions(loadedQuestions, questionsToSelect));
          setLoading(false);
        } catch (err) {
          console.error('Error loading questions:', err);
          setError(t('math_quiz.quiz_not_found'));
          setLoading(false);
        }
      };
      loadQuestions();
    }
  }, [showIntro, effectiveQuizId, t]);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
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
    let correctAnswers = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctAnswers += 1;
      }
    });
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    setResults({
      correct: correctAnswers,
      total: questions.length,
      percentage,
    });
    setIsCompleted(true);
  };

  const getCurrentQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return questions.slice(startIndex, endIndex);
  };

  const isCurrentPageComplete = () => {
    const currentQuestions = getCurrentQuestions();
    return currentQuestions.every((q) => answers[q.id] !== undefined);
  };

  const progressPercentage = () => {
    const answeredCount = Object.keys(answers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };

  const getFeedback = () => {
    if (!results) return '';
    if (results.percentage >= 80) return t('math_quiz.feedback_great');
    if (results.percentage >= 50) return t('math_quiz.feedback_good');
    return t('math_quiz.feedback_try_again');
  };

  // Show warning if quizId was invalid
  const isQuizIdInvalid = quizId && (isNaN(quizId) || quizId < 1);

  if (showIntro) {
    return (
      <div className="math-quiz-wrapper" dir={i18n.dir()}>
        <div className="math-quiz-container">
          <div className="math-quiz-intro-section">
            <h1 className="math-quiz-h1">{t('math_quiz.intro_title')}</h1>
            {isQuizIdInvalid && (
              <p className="math-quiz-p" style={{ color: '#F44336' }}>
                {t('math_quiz.invalid_quiz_id')} {t('math_quiz.using_default')}
              </p>
            )}
            <p className="math-quiz-p">{t('math_quiz.intro_description')}</p>
            <div className="math-quiz-button-group">
              <button
                onClick={() => setShowIntro(false)}
                className="math-quiz-next-button"
              >
                {t('math_quiz.start_button')}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="math-quiz-prev-button"
              >
                {t('math_quiz.back_button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="math-quiz-wrapper" dir={i18n.dir()}>
        <div className="math-quiz-loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="math-quiz-wrapper" dir={i18n.dir()}>
        <div className="math-quiz-error">{error}</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="math-quiz-prev-button mt-4"
        >
          {t('math_quiz.back_to_dashboard')}
        </button>
      </div>
    );
  }

  return (
    <div className="math-quiz-wrapper" dir={i18n.dir()}>
      <Sidebar />
      <div className="math-quiz-container">
        {!isCompleted ? (
          <>
            <div className="mb-6">
              <h1 className="math-quiz-h1">{t('math_quiz.title')}</h1>
              <p className="math-quiz-p">{t('math_quiz.instructions')}</p>
              <div className="math-quiz-progress-bar">
                <div
                  className="math-quiz-progress-bar-fill"
                  style={{ width: `${progressPercentage()}%` }}
                ></div>
              </div>
              <div className="math-quiz-progress-text">
                {Object.keys(answers).length} {t('math_quiz.of')} {questions.length} {t('math_quiz.questions')} ({progressPercentage()}%)
              </div>
            </div>

            <div className="mb-6">
              {getCurrentQuestions().map((question) => (
                <div key={question.id} className="math-quiz-question-card">
                  <div className="flex items-start mb-2">
                    <span className="math-quiz-question-number">{question.id}</span>
                    <p className="math-quiz-p">{question.text}</p>
                  </div>
                  <div className="math-quiz-radio-group">
                    {question.options.map((option, index) => (
                      <label key={index} className="math-quiz-radio-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={() => handleAnswer(question.id, option)}
                          className="math-quiz-radio-input"
                        />
                        <span className="math-quiz-radio-button">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="math-quiz-button-group">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="math-quiz-prev-button"
              >
                {t('math_quiz.previous')}
              </button>
              {currentPage * questionsPerPage >= questions.length ? (
                <button
                  onClick={calculateResults}
                  disabled={!isCurrentPageComplete()}
                  className="math-quiz-submit-button"
                >
                  {t('math_quiz.submit')}
                </button>
              ) : (
                <button
                  onClick={nextPage}
                  disabled={!isCurrentPageComplete()}
                  className="math-quiz-next-button"
                >
                  {t('math_quiz.next')}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="math-quiz-results-container">
            <h2 className="math-quiz-h2">{t('math_quiz.results')}</h2>
            <div className="math-quiz-score-card">
              <h2 className="math-quiz-h2">
                {t('math_quiz.correct_answers')}: {results.correct} {t('math_quiz.of')} {results.total}
              </h2>
              <p className="math-quiz-p">
                {t('math_quiz.percentage')}: {results.percentage}%
              </p>
              <p className="math-quiz-p font-bold">{getFeedback()}</p>
            </div>
            <div className="math-quiz-button-group">
              <button
                onClick={() => {
                  setAnswers({});
                  setIsCompleted(false);
                  setResults(null);
                  setCurrentPage(1);
                  setShowAnswers(false); // Reset review section
                  // Re-select 20 random questions on retry
                  setQuestions(selectRandomQuestions(questions, questionsToSelect));
                }}
                className="math-quiz-restart-button"
              >
                {t('math_quiz.retry')}
              </button>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className="math-quiz-review-button"
              >
                {showAnswers ? t('math_quiz.hide_answers') : t('math_quiz.show_answers')}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="math-quiz-prev-button"
              >
                {t('math_quiz.back_to_dashboard')}
              </button>
            </div>
            {showAnswers && (
              <div className="math-quiz-review-container mt-6">
                <h3 className="math-quiz-h3">{t('math_quiz.review_title')}</h3>
                {questions.map((question) => (
                  <div key={question.id} className="math-quiz-review-card mb-4 p-4 border rounded">
                    <div className="flex items-start mb-2">
                      <span className="math-quiz-question-number">{question.id}</span>
                      <p className="math-quiz-p">{question.text}</p>
                    </div>
                    <p className="math-quiz-p">
                      {t('math_quiz.correct_answer')}: <span className="text-green-600">{question.correctAnswer}</span>
                    </p>
                    <p className="math-quiz-p">
                      {t('math_quiz.your_answer')}: <span className={answers[question.id] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}>
                        {answers[question.id] || t('math_quiz.no_answer')}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathQuiz;