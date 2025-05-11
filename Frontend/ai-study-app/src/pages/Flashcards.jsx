import React from 'react';
import FlashcardGenerator from '../components/FlashcardGenerator';
import './styling/Flashcards.css';

function Flashcards() {
    return (
        <div className="flashcards-container">
            <h1 className="flashcards-header">Flashcards</h1>
            <FlashcardGenerator />
        </div>
    );
}

export default Flashcards;