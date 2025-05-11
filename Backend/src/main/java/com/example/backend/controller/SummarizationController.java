package com.example.backend.controller;

import com.example.backend.service.impl.GeminiAIService;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.apache.pdfbox.pdmodel.PDDocument;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/summarize")
public class SummarizationController {

    @Autowired
    private GeminiAIService aiService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAndSummarize(@RequestParam("files") MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return ResponseEntity.badRequest().body("No files uploaded.");
        }

        Map<String, String> summaries = new HashMap<>();

        try {
            for (MultipartFile file : files) {
                String text = extractTextFromPdf(file);

                if (text.length() > 8000) {
                    summaries.put(file.getOriginalFilename(), "PDF too long to summarize in one call.");
                } else {
                    String summary = aiService.getSummary(text);
                    summaries.put(file.getOriginalFilename(), summary);
                }
            }

            return ResponseEntity.ok(summaries);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing files.");
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}
