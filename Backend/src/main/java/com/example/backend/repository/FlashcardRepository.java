package com.example.backend.repository;

import com.example.backend.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findBySummaryId(Long summaryId);
    
    @Modifying
    @Query("DELETE FROM Flashcard f WHERE f.summary.id = ?1")
    void deleteBySummaryId(Long summaryId);
} 