import React, { useState } from 'react';
import './styling/Flashcard.css';

export default function Flashcard({ question, options, correctAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setFlipped(true);
  };

  const isCorrect = selectedOption === correctAnswer;

  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
      <div className="front">
        <h3>{question}</h3>
        <div className="options">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={flipped}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="back">
        <h3>{isCorrect ? '✅ Correct!' : '❌ Incorrect!'}</h3>
        <strong>{correctAnswer}</strong>
      </div>
    </div>
  );
}