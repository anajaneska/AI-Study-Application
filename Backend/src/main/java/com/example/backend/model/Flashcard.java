package com.example.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "flashcards")
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(name = "correct_answer_index", nullable = false)
    private Integer correctAnswerIndex;

    @ManyToOne
    @JoinColumn(name = "summary_id", nullable = false)
    @JsonBackReference
    private Summary summary;

    @Column(name = "is_answered", nullable = false)
    private boolean isAnswered = false;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect = false;

    @Column(nullable = false)
    private int attempts = 0;

    @ElementCollection
    @CollectionTable(
        name = "flashcard_answers",
        joinColumns = @JoinColumn(name = "flashcard_id")
    )
    @Column(name = "answer", nullable = false, columnDefinition = "TEXT")
    private List<String> answers = new ArrayList<>();

    public Flashcard() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Integer getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public Summary getSummary() {
        return summary;
    }

    public void setSummary(Summary summary) {
        this.summary = summary;
    }

    public boolean isAnswered() {
        return isAnswered;
    }

    public void setAnswered(boolean answered) {
        isAnswered = answered;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }

    public void incrementAttempts() {
        this.attempts++;
    }
} 