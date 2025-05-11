package com.example.backend.service;

import com.example.backend.model.Flashcard;
import java.util.List;

public interface FlashcardService {
    List<Flashcard> generateFlashcards(Long summaryId);
    List<Flashcard> getFlashcardsBySummaryId(Long summaryId);
    Flashcard checkAnswer(Long flashcardId, int selectedAnswerIndex);
    void deleteFlashcardsBySummaryId(Long summaryId);
} 