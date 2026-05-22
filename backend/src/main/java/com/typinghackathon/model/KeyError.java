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
@Table(name = "key_error")
public class KeyError {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "typing_result_id", nullable = false)
    private TypingResult typingResult;

    @Column(length = 8, nullable = false)
    private String expectedChar;

    @Column(length = 8)
    private String typedChar;

    private int count;

    public KeyError() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TypingResult getTypingResult() { return typingResult; }
    public void setTypingResult(TypingResult typingResult) { this.typingResult = typingResult; }

    public String getExpectedChar() { return expectedChar; }
    public void setExpectedChar(String expectedChar) { this.expectedChar = expectedChar; }

    public String getTypedChar() { return typedChar; }
    public void setTypedChar(String typedChar) { this.typedChar = typedChar; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
