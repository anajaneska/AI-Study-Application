package com.example.backend.controller;

import com.example.backend.service.impl.GeminiAIService;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.apache.pdfbox.pdmodel.PDDocument;



import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/summarize")
public class SummarizationController {

    @Autowired
    private GeminiAIService aiService;

    private static final String SUMMARY_DIRECTORY = "summaries/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAndSummarize(@RequestParam("file") MultipartFile file) {
        try {
            String text = extractTextFromPdf(file);

            if (text.length() > 8000) {
                return ResponseEntity.badRequest().body("PDF too long to summarize in one call.");
            }

            String summary = aiService.getSummary(text);

            // Save summary to a file
            String summaryFileName = UUID.randomUUID().toString() + ".txt";
            saveSummaryToFile(summary, summaryFileName);

            // Return the download URL
            String downloadUrl = "/api/summarize/download/" + summaryFileName;
            return ResponseEntity.ok(Map.of("summary", summary, "downloadUrl", downloadUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file.");
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

    private void saveSummaryToFile(String summary, String summaryFileName) throws IOException {
        Path path = Paths.get(SUMMARY_DIRECTORY + summaryFileName);
        Files.createDirectories(path.getParent()); // Ensure the directory exists
        Files.write(path, summary.getBytes());
    }

    // Endpoint to download the generated summary
    @GetMapping("/download/{summaryFileName}")
    public ResponseEntity<byte[]> downloadSummary(@PathVariable String summaryFileName) throws IOException {
        Path path = Paths.get(SUMMARY_DIRECTORY + summaryFileName);
        if (!Files.exists(path)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        byte[] content = Files.readAllBytes(path);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=" + summaryFileName)
                .body(content);
    }
}
