package com.example.backend.service.impl;

import com.example.backend.dto.TestResultRequest;
import com.example.backend.model.*;
import com.example.backend.repository.TestResultRepository;
import com.example.backend.repository.SummaryRepository;
import com.example.backend.repository.FlashcardRepository;
import com.example.backend.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TestServiceImpl implements TestService {
    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private SummaryRepository summaryRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Override
    public List<Map<String, Object>> generateTest(Long summaryId, int numQuestions) {
        Summary summary = summaryRepository.findById(summaryId)
            .orElseThrow(() -> new RuntimeException("Summary not found"));

        // Get all flashcards for this summary
        List<Flashcard> flashcards = flashcardRepository.findBySummaryId(summaryId);
        
        if (flashcards.isEmpty()) {
            throw new RuntimeException("No flashcards found for this summary");
        }

        // Randomly select flashcards for the test
        Collections.shuffle(flashcards);
        List<Flashcard> selectedFlashcards = flashcards.stream()
            .limit(Math.min(numQuestions, flashcards.size()))
            .collect(Collectors.toList());

        // Convert flashcards to test questions format
        return selectedFlashcards.stream()
            .map(flashcard -> {
                Map<String, Object> question = new HashMap<>();
                question.put("question", flashcard.getQuestion());
                question.put("options", flashcard.getAnswers());
                question.put("correctAnswer", flashcard.getAnswers().get(flashcard.getCorrectAnswerIndex()));
                return question;
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TestResult saveTestResult(Long summaryId, TestResultRequest request) {
        try {
            System.out.println("Processing request in service: " + request);
            
            Summary summary = summaryRepository.findById(summaryId)
                .orElseThrow(() -> new RuntimeException("Summary not found"));

            TestResult testResult = new TestResult();
            testResult.setSummary(summary);
            testResult.setTestDate(LocalDateTime.now());
            testResult.setTotalQuestions(request.getTotalQuestions());
            testResult.setCorrectAnswers(request.getCorrectAnswers());
            testResult.setScore(request.getScore());
            
            List<TestQuestionResult> questionResults = new ArrayList<>();

            for (TestResultRequest.QuestionResult result : request.getResults()) {
                TestQuestionResult questionResult = new TestQuestionResult();
                questionResult.setTestResult(testResult);
                questionResult.setQuestion(result.getQuestion());
                questionResult.setSelectedAnswer(result.getSelectedAnswer());
                questionResult.setCorrectAnswer(result.getCorrectAnswer());
                questionResult.setIsCorrect(result.getIsCorrect());
                questionResults.add(questionResult);
            }

            testResult.setQuestionResults(questionResults);

            return testResultRepository.save(testResult);
        } catch (Exception e) {
            throw new RuntimeException("Error saving test result: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TestResult> getTestHistory(Long summaryId) {
        return testResultRepository.findBySummaryIdOrderByTestDateDesc(summaryId);
    }

    @Override
    @Transactional
    public void deleteTest(Long testId) {
        TestResult testResult = testResultRepository.findById(testId)
            .orElseThrow(() -> new RuntimeException("Test not found"));
        testResultRepository.delete(testResult);
    }
} 