package com.typinghackathon.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "word_attempt")
public class WordAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "typing_result_id", nullable = false)
    private TypingResult typingResult;

    private int position;

    @Column(length = 128, nullable = false)
    private String expectedWord;

    @Column(length = 128)
    private String typedWord;

    private boolean correct;

    private long timeMs;

    private int mistakes;

    public WordAttempt() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TypingResult getTypingResult() { return typingResult; }
    public void setTypingResult(TypingResult typingResult) { this.typingResult = typingResult; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public String getExpectedWord() { return expectedWord; }
    public void setExpectedWord(String expectedWord) { this.expectedWord = expectedWord; }

    public String getTypedWord() { return typedWord; }
    public void setTypedWord(String typedWord) { this.typedWord = typedWord; }

    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }

    public long getTimeMs() { return timeMs; }
    public void setTimeMs(long timeMs) { this.timeMs = timeMs; }

    public int getMistakes() { return mistakes; }
    public void setMistakes(int mistakes) { this.mistakes = mistakes; }
}
