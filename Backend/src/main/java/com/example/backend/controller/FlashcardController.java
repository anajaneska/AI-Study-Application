package com.example.backend.controller;

import com.example.backend.model.Flashcard;
import com.example.backend.service.FlashcardService;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    private final FlashcardService flashcardService;

    @Autowired
    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @PostMapping("/generate/{summaryId}")
    public ResponseEntity<?> generateFlashcards(@PathVariable Long summaryId) {
        try {
            List<Flashcard> flashcards = flashcardService.generateFlashcards(summaryId);
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/summary/{summaryId}")
    public ResponseEntity<?> getFlashcardsBySummaryId(@PathVariable Long summaryId) {
        try {
            List<Flashcard> flashcards = flashcardService.getFlashcardsBySummaryId(summaryId);
            return ResponseEntity.ok(flashcards);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/summary/{summaryId}")
    public ResponseEntity<?> deleteFlashcardsBySummaryId(@PathVariable Long summaryId) {
        try {
            flashcardService.deleteFlashcardsBySummaryId(summaryId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{flashcardId}/check")
    public ResponseEntity<?> checkAnswer(
            @PathVariable Long flashcardId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer selectedAnswerIndex = request.get("selectedAnswerIndex");
            if (selectedAnswerIndex == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "selectedAnswerIndex is required"));
            }
            
            Flashcard result = flashcardService.checkAnswer(flashcardId, selectedAnswerIndex);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/download/{summaryId}")
    public ResponseEntity<Resource> downloadFlashcards(@PathVariable Long summaryId) {
        try {
            String fileName = "flashcards-summary-" + summaryId + ".txt";
            List<Flashcard> flashcards = flashcardService.getFlashcardsBySummaryId(summaryId);

            StringBuilder content = new StringBuilder();
            for (Flashcard flashcard : flashcards) {
                content.append("Q: ").append(flashcard.getQuestion()).append("\n");

                List<String> answers = flashcard.getAnswers();
                for (int i = 0; i < answers.size(); i++) {
                    content.append("   ").append((char) ('A' + i)).append(") ").append(answers.get(i)).append("\n");
                }

                Integer correctIndex = flashcard.getCorrectAnswerIndex();
                if (correctIndex != null && correctIndex >= 0 && correctIndex < answers.size()) {
                    content.append("Answer: ").append(answers.get(correctIndex)).append("\n\n");
                } else {
                    content.append("Answer: Not specified\n\n");
                }
            }

            ByteArrayResource resource = new ByteArrayResource(content.toString().getBytes(StandardCharsets.UTF_8));

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileName)
                    .contentType(MediaType.TEXT_PLAIN)
                    .contentLength(resource.contentLength())
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }



}