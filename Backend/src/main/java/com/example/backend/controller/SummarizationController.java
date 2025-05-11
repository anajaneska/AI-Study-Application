package com.example.backend.controller;

import com.example.backend.model.Summary;
import com.example.backend.repository.SummaryRepository;
import com.example.backend.service.impl.GeminiAIService;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.lang.StringBuilder;

@RestController
@RequestMapping("/api/summarize")
@CrossOrigin(origins = "http://localhost:5173")
public class SummarizationController {

    @Autowired
    private GeminiAIService aiService;

    @Autowired
    private SummaryRepository summaryRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAndSummarize(@RequestParam("file") MultipartFile[] files) {
        try {
            StringBuilder finalSummary = new StringBuilder();

            for (MultipartFile file : files) {
                String text = extractTextFromPdf(file);
                List<String> chunks = splitTextIntoChunks(text, 8000);

                finalSummary.append("=== Summary of: ").append(file.getOriginalFilename()).append(" ===\n\n");

                for (int i = 0; i < chunks.size(); i++) {
                    String chunkSummary = aiService.getSummary(chunks.get(i));
                    finalSummary.append("Part ").append(i + 1).append(":\n")
                            .append(chunkSummary).append("\n\n");
                }
            }

            // Save to DB
            Summary summaryEntity = new Summary();
            summaryEntity.setContent(finalSummary.toString());
            summaryEntity.setOriginalFileName("Multiple Files");
            summaryEntity.setCreatedAt(LocalDateTime.now());
            summaryEntity.setHasFlashcards(false);
            summaryRepository.save(summaryEntity);

            return ResponseEntity.ok(Map.of(
                    "summary", finalSummary.toString(),
                    "summaryId", summaryEntity.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing files: " + e.getMessage());
        }
    }


    @GetMapping("/summaries")
    public ResponseEntity<?> getSummaries() {
        return ResponseEntity.ok(summaryRepository.findAll());
    }

    @DeleteMapping("/summaries/{summaryId}")
    public ResponseEntity<?> deleteSummary(@PathVariable Long summaryId) {
        try {
            summaryRepository.deleteById(summaryId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            e.printStackTrace();
            throw e;
        }
    }

    private List<String> splitTextIntoChunks(String text, int maxChunkSize) {
        List<String> chunks = new ArrayList<>();
        int startIndex = 0;
        
        while (startIndex < text.length()) {
            int endIndex = Math.min(startIndex + maxChunkSize, text.length());
            
            // If we're not at the end of the text, try to find a good breaking point
            if (endIndex < text.length()) {
                // Look for the last period or newline within the last 100 characters
                int lastPeriod = text.lastIndexOf('.', endIndex);
                int lastNewline = text.lastIndexOf('\n', endIndex);
                int breakPoint = Math.max(lastPeriod, lastNewline);
                
                if (breakPoint > startIndex + maxChunkSize * 0.8) { // Only use break point if it's not too far back
                    endIndex = breakPoint + 1;
                }
            }
            
            chunks.add(text.substring(startIndex, endIndex).trim());
            startIndex = endIndex;
        }
        
        return chunks;
    }
}
