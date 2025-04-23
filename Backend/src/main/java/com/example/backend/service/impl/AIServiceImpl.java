package com.example.backend.service.impl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Autowired
    private RestTemplate restTemplate;

    public String getSummary(String text) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        Map<String, Object> userMessage = Map.of(
                "role", "user",
                "content", "Summarize the following text:\n\n" + text
        );

        Map<String, Object> request = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(userMessage)
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Map body = response.getBody();
                List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
                if (choices != null && !choices.isEmpty()) {
                    return (String) ((Map) choices.get(0).get("message")).get("content");
                } else {
                    throw new RuntimeException("No choices returned from OpenAI");
                }
            } else {
                throw new RuntimeException("OpenAI API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            e.printStackTrace(); // Log for debugging
            throw new RuntimeException("Error calling OpenAI API: " + e.getMessage());
        }

    }

}