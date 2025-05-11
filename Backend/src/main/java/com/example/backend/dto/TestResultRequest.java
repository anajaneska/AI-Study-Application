package com.example.backend.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class TestResultRequest {
    @JsonProperty("results")
    private List<QuestionResult> results;

    @JsonProperty("totalQuestions")
    private Integer totalQuestions;

    @JsonProperty("correctAnswers")
    private Integer correctAnswers;

    @JsonProperty("score")
    private Integer score;

    // Default constructor
    public TestResultRequest() {}

    // Getters and Setters
    public List<QuestionResult> getResults() {
        return results;
    }

    public void setResults(List<QuestionResult> results) {
        this.results = results;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "TestResultRequest{" +
                "results=" + results +
                ", totalQuestions=" + totalQuestions +
                ", correctAnswers=" + correctAnswers +
                ", score=" + score +
                '}';
    }

    public static class QuestionResult {
        @JsonProperty("question")
        private String question;

        @JsonProperty("selectedAnswer")
        private String selectedAnswer;

        @JsonProperty("correctAnswer")
        private String correctAnswer;

        @JsonProperty("isCorrect")
        private Boolean isCorrect;

        // Default constructor
        public QuestionResult() {}

        // Getters and Setters
        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getSelectedAnswer() {
            return selectedAnswer;
        }

        public void setSelectedAnswer(String selectedAnswer) {
            this.selectedAnswer = selectedAnswer;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }

        @Override
        public String toString() {
            return "QuestionResult{" +
                    "question='" + question + '\'' +
                    ", selectedAnswer='" + selectedAnswer + '\'' +
                    ", correctAnswer='" + correctAnswer + '\'' +
                    ", isCorrect=" + isCorrect +
                    '}';
        }
    }
} 