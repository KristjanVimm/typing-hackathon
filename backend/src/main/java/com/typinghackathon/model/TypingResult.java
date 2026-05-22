package com.typinghackathon.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "typing_result",
        indexes = {
                @Index(name = "idx_typing_result_user", columnList = "userId"),
                @Index(name = "idx_typing_result_created_at", columnList = "createdAt")
        }
)
public class TypingResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 64)
    private String sessionId;

    @Column(length = 64)
    private String userId;

    private double wpm;
    private double rawWpm;
    private double accuracy;
    private long durationMs;

    private int totalCharacters;
    private int correctCharacters;
    private int incorrectCharacters;

    private int totalWords;
    private int correctWords;
    private int incorrectWords;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "typingResult", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WordAttempt> wordAttempts = new ArrayList<>();

    @OneToMany(mappedBy = "typingResult", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<KeyError> keyErrors = new ArrayList<>();

    public TypingResult() {}

    public void addWordAttempt(WordAttempt attempt) {
        attempt.setTypingResult(this);
        wordAttempts.add(attempt);
    }

    public void addKeyError(KeyError error) {
        error.setTypingResult(this);
        keyErrors.add(error);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public double getWpm() { return wpm; }
    public void setWpm(double wpm) { this.wpm = wpm; }

    public double getRawWpm() { return rawWpm; }
    public void setRawWpm(double rawWpm) { this.rawWpm = rawWpm; }

    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

    public long getDurationMs() { return durationMs; }
    public void setDurationMs(long durationMs) { this.durationMs = durationMs; }

    public int getTotalCharacters() { return totalCharacters; }
    public void setTotalCharacters(int totalCharacters) { this.totalCharacters = totalCharacters; }

    public int getCorrectCharacters() { return correctCharacters; }
    public void setCorrectCharacters(int correctCharacters) { this.correctCharacters = correctCharacters; }

    public int getIncorrectCharacters() { return incorrectCharacters; }
    public void setIncorrectCharacters(int incorrectCharacters) { this.incorrectCharacters = incorrectCharacters; }

    public int getTotalWords() { return totalWords; }
    public void setTotalWords(int totalWords) { this.totalWords = totalWords; }

    public int getCorrectWords() { return correctWords; }
    public void setCorrectWords(int correctWords) { this.correctWords = correctWords; }

    public int getIncorrectWords() { return incorrectWords; }
    public void setIncorrectWords(int incorrectWords) { this.incorrectWords = incorrectWords; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<WordAttempt> getWordAttempts() { return wordAttempts; }
    public void setWordAttempts(List<WordAttempt> wordAttempts) { this.wordAttempts = wordAttempts; }

    public List<KeyError> getKeyErrors() { return keyErrors; }
    public void setKeyErrors(List<KeyError> keyErrors) { this.keyErrors = keyErrors; }
}
