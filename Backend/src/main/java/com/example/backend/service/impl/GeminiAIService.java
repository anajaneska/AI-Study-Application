package com.example.backend.service.impl;

import com.example.backend.service.AIService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService implements AIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String getSummary(String text) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            String prompt = """
                Please provide a comprehensive and detailed summary of the following text. 
                Include all key points, main ideas, and important details. 
                Structure the summary with clear sections and bullet points where appropriate. 
                Aim for a thorough understanding of the content while maintaining clarity.
                
                Text to summarize:
                %s
                """.formatted(text);

            String requestBody = objectMapper.writeValueAsString(Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of(
                        "text", prompt
                    ))
                ))
            ));

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey;

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            // Parse JSON response
            JsonNode root = objectMapper.readTree(response.getBody());
            return root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "Failed to process summary request: " + e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to generate summary: " + e.getMessage();
        }
    }


    private String extractSummary(String responseJson) {
        // TODO: Реално парсирање од JSON (може со Jackson)
        return "Parsed summary";
    }
}