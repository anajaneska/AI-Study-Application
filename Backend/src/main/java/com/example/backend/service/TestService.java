package com.example.backend.service;

import com.example.backend.dto.TestResultRequest;
import com.example.backend.model.TestResult;
import java.util.List;
import java.util.Map;

public interface TestService {
    List<Map<String, Object>> generateTest(Long summaryId, int numQuestions);
    TestResult saveTestResult(Long summaryId, TestResultRequest request);
    List<TestResult> getTestHistory(Long summaryId);
    void deleteTest(Long testId);
} 