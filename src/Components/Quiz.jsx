import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import { data } from '../assets/data';


const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [answered, setAnswered] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [buttonText, setButtonText] = useState("Next");

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const option_array = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    if (index < data.length) {
      setTimer(10);
      setAnswered(false);
      setLock(false);
      setBlocked(false);
      setButtonText("Next");

      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(interval);
            setLock(true);
            setAnswered(true);
            setTimeout(() => next(), 1000);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [index]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add('correct');
        setScore(prev => prev + 1);
      } else {
        e.target.classList.add('wrong');
        option_array[question.ans - 1].current.classList.add('correct');
      }
      setLock(true);
      setAnswered(true);
    }
  };

  const next = () => {
    if (timer > 0 && index < data.length - 1) {
      setBlocked(true);
      setButtonText("🚫 Wait");
      setTimeout(() => {
        setBlocked(false);
        setButtonText("Next");
      }, 1000);
      return;
    }

    if (answered || index === data.length - 1) {
      if (index + 1 === data.length) {
        // Play sound
        const sound = document.getElementById('end-sound');
        if (sound) sound.play();
        setIndex(prev => prev + 1);
      } else {
        const newIndex = index + 1;
        setIndex(newIndex);
        setQuestion(data[newIndex]);
        setLock(false);
        setAnswered(false);
        option_array.forEach(option => {
          option.current.classList.remove('correct');
          option.current.classList.remove('wrong');
        });
      }
    }
  };

  const restart = () => {
    setIndex(0);
    setQuestion(data[0]);
    setScore(0);
    setLock(false);
    setAnswered(false);
    setBlocked(false);
    setButtonText("Next");
    option_array.forEach(option => {
      option.current.classList.remove('correct');
      option.current.classList.remove('wrong');
    });
  };

  const getEmojiMessage = () => {
    const total = data.length;
    if (score === total) return "🏆 Perfect!";
    else if (score >= total * 0.7) return "🎉 Great job!";
    else if (score >= total * 0.4) return "👍 Not bad!";
    else return "😢 Better luck next time!";
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      <audio id="end-sound" src="/quiz-end.mp3" preload="auto" />
      {index < data.length ? (
        <>
          <h2>{index + 1}. {question.question}</h2>
          <div className="timer">Time Left: {timer}s</div>
          <ul>
            <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question.option1}</li>
            <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question.option2}</li>
            <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question.option3}</li>
            <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question.option4}</li>
          </ul>
          <button
            onClick={next}
            className={`next-btn ${blocked ? 'blocked' : ''}`}
          >
            {buttonText}
          </button>
          <div className="index">{index + 1} of {data.length} questions</div>
        </>
      ) : (
        <div className="result">
          <h2>Quiz Completed!</h2>
          <p>Your score is {score} out of {data.length}</p>
          <div className="emoji animated">{getEmojiMessage()}</div>
          <button className="restart-btn" onClick={restart}>Restart Quiz</button>
          <a
            className="share-btn"
            href={`https://wa.me/?text=${encodeURIComponent(`I scored ${score}/${data.length} on this quiz! Try it now! 🤩`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on WhatsApp
          </a>
          <a
            className="share-btn twitter-btn"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I scored ${score}/${data.length} on this quiz! 🎯 Try it here!`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on Twitter
          </a>
        </div>
      )}
    </div>
  );
};

export default Quiz;
