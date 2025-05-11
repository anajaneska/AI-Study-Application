package com.example.backend.repository;

import com.example.backend.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SummaryRepository extends JpaRepository<Summary, Long> {
    List<Summary> findByHasFlashcardsFalse();
    List<Summary> findAllByOrderByCreatedAtDesc();
} 