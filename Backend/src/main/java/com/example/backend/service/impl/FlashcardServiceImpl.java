package com.example.backend.service.impl;

import com.example.backend.model.Flashcard;
import com.example.backend.model.Summary;
import com.example.backend.repository.FlashcardRepository;
import com.example.backend.repository.SummaryRepository;
import com.example.backend.service.FlashcardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlashcardServiceImpl implements FlashcardService {
    private static final Logger logger = LoggerFactory.getLogger(FlashcardServiceImpl.class);
    private final FlashcardRepository flashcardRepository;
    private final SummaryRepository summaryRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    public FlashcardServiceImpl(FlashcardRepository flashcardRepository, 
                              SummaryRepository summaryRepository) {
        this.flashcardRepository = flashcardRepository;
        this.summaryRepository = summaryRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    @Transactional
    public List<Flashcard> generateFlashcards(Long summaryId) {
        logger.info("Generating flashcards for summary ID: {}", summaryId);
        
        Summary summary = summaryRepository.findById(summaryId)
            .orElseThrow(() -> new RuntimeException("Summary not found with id: " + summaryId));
        
        logger.info("Found summary: {}", summary.getOriginalFileName());

        String prompt = String.format(
            "Generate 5 multiple choice questions based on the following content. " +
            "For each question, provide 4 possible answers and indicate the correct one. " +
            "Format the response as a JSON array of objects with 'question', 'answers' (array of 4 strings), " +
            "and 'correctAnswerIndex' (0-based index of the correct answer). " +
            "Content: %s",
            summary.getContent()
        );

        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        String requestBody = String.format(
            "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}]}",
            prompt.replace("\"", "\\\"")
        );
        
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        
        logger.info("Sending request to Gemini API");
        String response = restTemplate.postForObject(apiUrl, request, String.class);
        logger.info("Received response from Gemini API");
        
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode candidates = root.path("candidates");
            if (candidates.isEmpty() || !candidates.get(0).has("content")) {
                throw new RuntimeException("Invalid API response format");
            }
            
            String content = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
            logger.info("Parsed content from response");
            
            // Extract JSON array from the response text
            int startIndex = content.indexOf('[');
            int endIndex = content.lastIndexOf(']') + 1;
            if (startIndex == -1 || endIndex == 0) {
                throw new RuntimeException("No JSON array found in response");
            }
            
            String jsonArray = content.substring(startIndex, endIndex);
            JsonNode flashcardsArray = objectMapper.readTree(jsonArray);
            
            List<Flashcard> flashcards = new ArrayList<>();
            for (JsonNode flashcardNode : flashcardsArray) {
                Flashcard flashcard = new Flashcard();
                flashcard.setQuestion(flashcardNode.path("question").asText());
                
                List<String> answers = new ArrayList<>();
                JsonNode answersNode = flashcardNode.path("answers");
                for (JsonNode answer : answersNode) {
                    answers.add(answer.asText());
                }
                flashcard.setAnswers(answers);
                
                flashcard.setCorrectAnswerIndex(flashcardNode.path("correctAnswerIndex").asInt());
                flashcard.setSummary(summary);
                
                // Validate the flashcard
                if (flashcard.getQuestion() == null || flashcard.getQuestion().trim().isEmpty()) {
                    throw new RuntimeException("Question cannot be null or empty");
                }
                if (flashcard.getAnswers() == null || flashcard.getAnswers().size() != 4) {
                    throw new RuntimeException("Flashcard must have exactly 4 answers");
                }
                if (flashcard.getCorrectAnswerIndex() < 0 || flashcard.getCorrectAnswerIndex() >= 4) {
                    throw new RuntimeException("Correct answer index must be between 0 and 3");
                }
                
                flashcards.add(flashcard);
            }
            
            logger.info("Saving {} flashcards to database", flashcards.size());
            List<Flashcard> savedFlashcards = flashcardRepository.saveAll(flashcards);
            
            summary.setHasFlashcards(true);
            summaryRepository.save(summary);
            
            logger.info("Successfully generated and saved flashcards");
            return savedFlashcards;
            
        } catch (Exception e) {
            logger.error("Error generating flashcards: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate flashcards: " + e.getMessage());
        }
    }

    @Override
    public List<Flashcard> getFlashcardsBySummaryId(Long summaryId) {
        return flashcardRepository.findBySummaryId(summaryId);
    }

    @Override
    @Transactional
    public Flashcard checkAnswer(Long flashcardId, int selectedAnswerIndex) {
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
            .orElseThrow(() -> new RuntimeException("Flashcard not found"));

        // Check if the selected answer is correct
        boolean isCorrect = selectedAnswerIndex == flashcard.getCorrectAnswerIndex();
        
        // Update flashcard state
        flashcard.setCorrect(isCorrect);
        flashcard.setAnswered(true);
        flashcard.incrementAttempts();
        
        return flashcardRepository.save(flashcard);
    }

    @Override
    @Transactional
    public void deleteFlashcardsBySummaryId(Long summaryId) {
        Summary summary = summaryRepository.findById(summaryId)
            .orElseThrow(() -> new RuntimeException("Summary not found"));
        
        // Delete all flashcards associated with the summary
        flashcardRepository.deleteBySummaryId(summaryId);
        
        // Update summary's hasFlashcards flag
        summary.setHasFlashcards(false);
        summaryRepository.save(summary);
    }
}