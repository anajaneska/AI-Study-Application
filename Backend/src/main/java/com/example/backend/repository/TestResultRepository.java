package com.example.backend.repository;

import com.example.backend.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findBySummaryIdOrderByTestDateDesc(Long summaryId);
} 