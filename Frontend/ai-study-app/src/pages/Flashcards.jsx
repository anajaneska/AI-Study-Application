import Flashcard from "../components/Flashcard"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./styling/Flashcards.css"

function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10&category=18')
      .then(response => {
        const loadedFlashcards = response.data.results.map((questionItem, index) => {
          const allOptions = [...questionItem.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * (allOptions.length + 1));
          allOptions.splice(randomIndex, 0, questionItem.correct_answer);

          return {
            id: `${index}-${Date.now()}`,
            question: decodeHtml(questionItem.question),
            options: allOptions.map(option => decodeHtml(option)),
            correctAnswer: decodeHtml(questionItem.correct_answer)
          };
        });

        setFlashcards(loadedFlashcards);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching questions: ", error);
        setLoading(false);
      });
  }, []);

  function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const handleNext = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleGoAgain = () => {
    setCurrentIndex(0);
  }

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  if (currentIndex >= flashcards.length) {
    return <div className="completed">
        <h1>You've completed all flashcards!</h1>
        <button onClick={handleGoAgain}>GO AGAIN</button>
    </div>;
  }

  return (
    <div className="cards">
      <Flashcard
        key={flashcards[currentIndex].id}
        question={flashcards[currentIndex].question}
        options={flashcards[currentIndex].options}
        correctAnswer={flashcards[currentIndex].correctAnswer}
      />
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default Flashcards