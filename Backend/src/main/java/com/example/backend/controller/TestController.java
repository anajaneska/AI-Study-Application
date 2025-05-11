package com.example.backend.controller;

import com.example.backend.dto.TestResultRequest;
import com.example.backend.model.TestResult;
import com.example.backend.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "http://localhost:5173")
public class TestController {
    @Autowired
    private TestService testService;

    @GetMapping("/generate/{summaryId}")
    public ResponseEntity<List<Map<String, Object>>> generateTest(
            @PathVariable Long summaryId,
            @RequestParam(defaultValue = "5") int numQuestions) {
        return ResponseEntity.ok(testService.generateTest(summaryId, numQuestions));
    }

    @PostMapping("/{summaryId}/results")
    public ResponseEntity<?> saveTestResult(
            @PathVariable Long summaryId,
            @RequestBody TestResultRequest request) {
        try {
            System.out.println("Received request body: " + request);
            if (request == null || request.getResults() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid request body"));
            }
            TestResult result = testService.saveTestResult(summaryId, request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            System.err.println("Server error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history/{summaryId}")
    public ResponseEntity<List<TestResult>> getTestHistory(@PathVariable Long summaryId) {
        return ResponseEntity.ok(testService.getTestHistory(summaryId));
    }

    @DeleteMapping("/{testId}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long testId) {
        testService.deleteTest(testId);
        return ResponseEntity.ok().build();
    }
} 